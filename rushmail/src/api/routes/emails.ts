import { Hono } from "hono";
import { db } from '../database/index.js';
import * as schema from '../database/schema.js';
import { eq, desc, and } from "drizzle-orm";
import { requireAuth, authMiddleware } from '../middleware/auth.js';
import { randomUUID } from "crypto";
import { account } from '../database/auth-schema.js';
import { generatePublicId, decryptToken, encryptToken } from "../utils/crypto.js";
import { logAudit, logSecurityEvent } from "../utils/logger.js";
import { emailSendingQuotas } from "../middleware/rate-limit.js";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const sendEmailSchema = z.object({
  to: z.union([z.string().email(), z.array(z.string().email())]),
  subject: z.string().min(1).max(500),
  html: z.string().min(1).max(100000),
  scheduledAt: z.string().optional(),
});

const draftEmailSchema = z.object({
  to: z.union([z.string().email(), z.array(z.string().email())]).optional(),
  subject: z.string().max(500).optional(),
  html: z.string().max(100000).optional(),
});

// ─── Send via Gmail API ───────────────────────────────────────────────────────
async function refreshGmailToken(refreshToken: string): Promise<{ accessToken: string; expiresAt: Date }> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });
  const data = await res.json() as any;
  if (!res.ok || data.error) throw new Error(data.error_description || "Failed to refresh Gmail token");
  return {
    accessToken: data.access_token,
    expiresAt: new Date(Date.now() + data.expires_in * 1000),
  };
}

async function getValidGmailToken(userId: string): Promise<{ token: string }> {
  const [googleAccount] = await db
    .select()
    .from(account)
    .where(and(eq(account.userId, userId), eq(account.providerId, "google")));

  if (!googleAccount) {
    throw new Error("NO_GOOGLE_ACCOUNT");
  }

  const bufferMs = 5 * 60 * 1000;
  const now = new Date();

  // Tokens in DB are encrypted
  let accessToken = decryptToken(googleAccount.accessToken!);

  if (googleAccount.accessTokenExpiresAt && googleAccount.accessTokenExpiresAt.getTime() - bufferMs < now.getTime()) {
    if (!googleAccount.refreshToken) throw new Error("NO_REFRESH_TOKEN");
    
    const decryptedRefreshToken = decryptToken(googleAccount.refreshToken);
    const refreshed = await refreshGmailToken(decryptedRefreshToken);
    accessToken = refreshed.accessToken;
    
    // Update stored token (encrypted)
    await db.update(account)
      .set({ 
        accessToken: encryptToken(refreshed.accessToken), 
        accessTokenExpiresAt: refreshed.expiresAt 
      })
      .where(eq(account.id, googleAccount.id));
  }

  return { token: accessToken };
}

async function sendViaGmail(
  accessToken: string,
  opts: { from: string; to: string | string[]; subject: string; html: string }
) {
  const toAddresses = Array.isArray(opts.to) ? opts.to : [opts.to];
  const boundary = "mercia_" + randomUUID().replace(/-/g, "");
  const mime = [
    `MIME-Version: 1.0`,
    `To: ${toAddresses.join(", ")}`,
    `From: ${opts.from}`,
    `Subject: ${opts.subject}`,
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    ``,
    `--${boundary}`,
    `Content-Type: text/plain; charset="UTF-8"`,
    ``,
    opts.html.replace(/<[^>]+>/g, ""),
    ``,
    `--${boundary}`,
    `Content-Type: text/html; charset="UTF-8"`,
    ``,
    opts.html,
    ``,
    `--${boundary}--`,
  ].join("\r\n");

  const encoded = Buffer.from(mime).toString("base64url");
  const res = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({ raw: encoded }),
  });
  const data = await res.json() as any;
  if (!res.ok) throw new Error(data.error?.message || "Gmail send failed");
  return data;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function wrapBareUrls(html: string): string {
  if (/<[a-zA-Z]/.test(html)) return html;
  const escaped = html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br>");
  return escaped.replace(/(https?:\/\/[^\s<>"']+)/g, '<a href="$1">$1</a>');
}

function injectTrackingPixel(html: string, publicTrackingId: string, baseUrl: string): string {
  const pixelUrl = `${baseUrl}/api/track/open/${publicTrackingId}`;
  const pixel = `<img src="${pixelUrl}" width="1" height="1" style="display:none;" alt="" />`;
  if (html.includes("</body>")) return html.replace("</body>", `${pixel}</body>`);
  return html + pixel;
}

function injectTrackedLinks(
  html: string,
  emailId: string,
  userId: string,
  baseUrl: string,
  userResumes: typeof schema.resumes.$inferSelect[] = []
): { html: string; links: { shortCode: string; originalUrl: string }[] } {
  const links: { shortCode: string; originalUrl: string }[] = [];
  
  const addLink = (url: string) => {
    if (links.length >= 5) return null; // Max 5 limits enforced silently during link generation
    const shortCode = generatePublicId();
    links.push({ shortCode, originalUrl: url });
    return shortCode;
  };

  const withWrapped = html.replace(
    /(?<!href=")(https?:\/\/[^\s<>"']+)(?![^<]*?>)(?![^<]*?<\/a>)/g,
    (url) => {
      if (url.startsWith(baseUrl + "/api/track/")) {
        return `<a href="${url}">${url}</a>`;
      }
      const resume = userResumes.find(r => r.url === url);
      if (resume) {
        return `<a href="${baseUrl}/api/track/resume/${resume.publicTrackingId}">${url}</a>`;
      }
      const shortCode = addLink(url);
      if (!shortCode) return url;
      return `<a href="${baseUrl}/api/track/click/${shortCode}">${url}</a>`;
    }
  );

  const urlRegex = /href="(https?:\/\/[^"]+)"/g;
  const newHtml = withWrapped.replace(urlRegex, (match, url) => {
    if (url.startsWith(baseUrl + "/api/track/")) return match;
    const resume = userResumes.find(r => r.url === url);
    if (resume) {
      return `href="${baseUrl}/api/track/resume/${resume.publicTrackingId}"`;
    }
    const shortCode = addLink(url);
    if (!shortCode) return match;
    return `href="${baseUrl}/api/track/click/${shortCode}"`;
  });

  return { html: newHtml, links };
}

// ─── Router ───────────────────────────────────────────────────────────────────
export const emailsRouter = new Hono()
  .use("*", authMiddleware)
  .get("/", requireAuth, async (c) => {
    const user = c.get("user")!;
    const emailList = await db
      .select()
      .from(schema.emails)
      .where(eq(schema.emails.userId, user.id))
      .orderBy(desc(schema.emails.createdAt));

    const emailsWithStats = await Promise.all(
      emailList.map(async (email) => {
        const events = await db
          .select()
          .from(schema.emailEvents)
          .where(eq(schema.emailEvents.emailId, email.id));
        return {
          ...email,
          openCount: email.totalOpens || 0,
          clickCount: events.filter(e => e.type === "click").length,
          events,
        };
      })
    );

    return c.json({ emails: emailsWithStats }, 200);
  })
  .post("/send", requireAuth, emailSendingQuotas, zValidator("json", sendEmailSchema), async (c) => {
    const user = c.get("user")!;
    const { to, subject, html, scheduledAt } = c.req.valid("json");

    const publicTrackingId = generatePublicId();
    const emailId = randomUUID();
    const baseUrl = process.env.WEBSITE_URL?.replace(/\/$/, "") || "http://localhost:4200";

    const processedHtml = wrapBareUrls(html);
    const userResumes = await db.select().from(schema.resumes).where(eq(schema.resumes.userId, user.id));

    const { html: trackedHtml, links } = injectTrackedLinks(
      injectTrackingPixel(processedHtml, publicTrackingId, baseUrl),
      emailId,
      user.id,
      baseUrl,
      userResumes
    );

    if (links.length > 0) {
      await db.insert(schema.trackedLinks).values(
        links.map(l => ({
          id: randomUUID(),
          emailId,
          userId: user.id,
          originalUrl: l.originalUrl,
          shortCode: l.shortCode,
        }))
      );
    }

    // Get Gmail token from the user's Google OAuth account
    let gmailToken: string;
    try {
      const result = await getValidGmailToken(user.id);
      gmailToken = result.token;
    } catch (err: any) {
      if (err.message === "NO_GOOGLE_ACCOUNT") {
        return c.json({
          message: "no_google_account",
          detail: "Please sign in with Google to send emails from your Gmail account.",
        }, 403);
      }
      return c.json({ message: `Failed to get Gmail credentials: ${err.message}` }, 500);
    }

    const senderEmail = user.email;

    try {
      await sendViaGmail(gmailToken, {
        from: `${user.name || "Merica"} <${senderEmail}>`,
        to,
        subject,
        html: trackedHtml,
      });
      // Zero out token from memory immediately
      gmailToken = ""; 
    } catch (err: any) {
      // Save as draft if send fails
      await db.insert(schema.emails).values({
        id: emailId,
        userId: user.id,
        to: Array.isArray(to) ? to.join(", ") : to,
        subject,
        body: html,
        status: "draft",
        sentAt: null,
        publicTrackingId,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        engagementScore: 0,
      });
      return c.json({ message: `Send failed: ${err.message}`, emailId }, 500);
    }

    const now = new Date();
    await db.insert(schema.emails).values({
      id: emailId,
      userId: user.id,
      to: Array.isArray(to) ? to.join(", ") : to,
      subject,
      body: html,
      status: "sent",
      sentAt: now,
      publicTrackingId,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      engagementScore: 0,
      firstOpenAt: null,
      uniqueOpens: 0,
      totalOpens: 0,
    });

    await db.insert(schema.notifications).values({
      id: randomUUID(),
      userId: user.id,
      emailId,
      type: "sent",
      title: "Email sent",
      body: `Your email to ${to} was sent successfully via Gmail.`,
      read: false,
    });

    await logAudit({
      userId: user.id,
      actionType: "send_email",
      resourceId: emailId,
      status: "success",
    });

    return c.json({ success: true, emailId, publicTrackingId, sentVia: "gmail", fromEmail: senderEmail }, 201);
  })
  .post("/draft", requireAuth, zValidator("json", draftEmailSchema), async (c) => {
    const user = c.get("user")!;
    const { to, subject, html } = c.req.valid("json");

    const emailId = randomUUID();
    const publicTrackingId = generatePublicId();

    const toString = Array.isArray(to) ? to.join(", ") : to || "";

    await db.insert(schema.emails).values({
      id: emailId,
      userId: user.id,
      to: toString,
      subject: subject || "",
      body: html || "",
      status: "draft",
      publicTrackingId,
      engagementScore: 0,
    });

    return c.json({ success: true, emailId }, 201);
  })
  .get("/:id", requireAuth, async (c) => {
    const user = c.get("user")!;
    const { id } = c.req.param();

    const [email] = await db
      .select()
      .from(schema.emails)
      .where(and(eq(schema.emails.id, id), eq(schema.emails.userId, user.id)));

    if (!email) return c.json({ message: "Not found" }, 404);

    const events = await db
      .select()
      .from(schema.emailEvents)
      .where(eq(schema.emailEvents.emailId, id))
      .orderBy(desc(schema.emailEvents.createdAt));

    const links = await db
      .select()
      .from(schema.trackedLinks)
      .where(eq(schema.trackedLinks.emailId, id));

    return c.json({ email, events, links }, 200);
  });
