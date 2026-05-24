import { Hono } from "hono";
import { db } from '../database/index.js';
import * as schema from '../database/schema.js';
import { eq, desc, and } from "drizzle-orm";
import { requireAuth, authMiddleware } from '../middleware/auth.js';
import { randomUUID } from "crypto";
import { account } from '../database/auth-schema.js';

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

  let accessToken = googleAccount.accessToken!;

  if (googleAccount.accessTokenExpiresAt && googleAccount.accessTokenExpiresAt.getTime() - bufferMs < now.getTime()) {
    if (!googleAccount.refreshToken) throw new Error("NO_REFRESH_TOKEN");
    const refreshed = await refreshGmailToken(googleAccount.refreshToken);
    accessToken = refreshed.accessToken;
    // Update stored token
    await db.update(account)
      .set({ accessToken: refreshed.accessToken, accessTokenExpiresAt: refreshed.expiresAt })
      .where(eq(account.id, googleAccount.id));
  }

  // accountId is the Google user ID (numeric), not email — caller must pass email separately
  return { token: accessToken };
}

async function sendViaGmail(
  accessToken: string,
  opts: { from: string; to: string | string[]; subject: string; html: string }
) {
  const toAddresses = Array.isArray(opts.to) ? opts.to : [opts.to];
  const boundary = "coldpulse_" + randomUUID().replace(/-/g, "");
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
function generateTrackingId() {
  return randomUUID();
}

function wrapBareUrls(html: string): string {
  if (/<[a-zA-Z]/.test(html)) return html;
  const escaped = html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br>");
  return escaped.replace(/(https?:\/\/[^\s<>"']+)/g, '<a href="$1">$1</a>');
}

function injectTrackingPixel(html: string, trackingId: string, baseUrl: string): string {
  const pixelUrl = `${baseUrl}/api/track/open/${trackingId}`;
  const pixel = `<img src="${pixelUrl}" width="1" height="1" style="display:none;" alt="" />`;
  if (html.includes("</body>")) return html.replace("</body>", `${pixel}</body>`);
  return html + pixel;
}

function injectTrackedLinks(
  html: string,
  emailId: string,
  userId: string,
  baseUrl: string
): { html: string; links: { shortCode: string; originalUrl: string }[] } {
  const links: { shortCode: string; originalUrl: string }[] = [];
  const withWrapped = html.replace(
    /(?<!href=")(https?:\/\/[^\s<>"']+)(?![^<]*?>)(?![^<]*?<\/a>)/g,
    (url) => {
      const shortCode = randomUUID().replace(/-/g, "").substring(0, 12);
      links.push({ shortCode, originalUrl: url });
      return `<a href="${baseUrl}/api/track/click/${shortCode}">${url}</a>`;
    }
  );
  const urlRegex = /href="(https?:\/\/[^"]+)"/g;
  const newHtml = withWrapped.replace(urlRegex, (match, url) => {
    if (url.startsWith(baseUrl + "/api/track/")) return match;
    const shortCode = randomUUID().replace(/-/g, "").substring(0, 12);
    links.push({ shortCode, originalUrl: url });
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
          openCount: events.filter(e => e.type === "open").length,
          clickCount: events.filter(e => e.type === "click").length,
          events,
        };
      })
    );

    return c.json({ emails: emailsWithStats }, 200);
  })
  .post("/send", requireAuth, async (c) => {
    const user = c.get("user")!;
    const body = await c.req.json();
    const { to, subject, html, scheduledAt } = body;

    if (!to || !subject || !html) {
      return c.json({ message: "to, subject, and html are required" }, 400);
    }

    const trackingId = generateTrackingId();
    const emailId = randomUUID();
    const baseUrl = process.env.WEBSITE_URL?.replace(/\/$/, "") || "http://localhost:4200";

    const processedHtml = wrapBareUrls(html);
    const { html: trackedHtml, links } = injectTrackedLinks(
      injectTrackingPixel(processedHtml, trackingId, baseUrl),
      emailId,
      user.id,
      baseUrl
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
        from: `${user.name || "ColdPulse"} <${senderEmail}>`,
        to,
        subject,
        html: trackedHtml,
      });
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
        trackingId,
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
      trackingId,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      engagementScore: 0,
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

    return c.json({ success: true, emailId, trackingId, sentVia: "gmail", fromEmail: senderEmail }, 201);
  })
  .post("/draft", requireAuth, async (c) => {
    const user = c.get("user")!;
    const body = await c.req.json();
    const { to, subject, html } = body;

    const emailId = randomUUID();
    const trackingId = generateTrackingId();

    await db.insert(schema.emails).values({
      id: emailId,
      userId: user.id,
      to: to || "",
      subject: subject || "",
      body: html || "",
      status: "draft",
      trackingId,
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
