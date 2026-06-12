import { Hono } from "hono";
import { db } from '../database/index.js';
import * as schema from '../database/schema.js';
import { eq, and } from "drizzle-orm";
import { randomUUID } from "crypto";
import { trackingRateLimiter } from "../middleware/rate-limit.js";

// 1x1 transparent GIF
const TRACKING_PIXEL = Buffer.from(
  "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
  "base64"
);

function parseUserAgent(ua: string): { browser: string; os: string; deviceType: string } {
  const browser = ua.includes("Chrome") ? "Chrome"
    : ua.includes("Firefox") ? "Firefox"
      : ua.includes("Safari") ? "Safari"
        : ua.includes("Edge") ? "Edge"
          : "Unknown";

  const os = ua.includes("Windows") ? "Windows"
    : ua.includes("Mac") ? "macOS"
      : ua.includes("Linux") ? "Linux"
        : ua.includes("Android") ? "Android"
          : ua.includes("iOS") ? "iOS"
            : "Unknown";

  const deviceType = ua.includes("Mobile") || ua.includes("Android") ? "mobile"
    : ua.includes("Tablet") ? "tablet"
      : "desktop";

  return { browser, os, deviceType };
}

function isBot(ua: string): boolean {
  // Gmail opens always go through GoogleImageProxy. We must treat them as legitimate opens, not bots.
  if (ua.includes("GoogleImageProxy")) return false;
  
  const botRegex = /bot|crawler|spider|google|bing|yandex|baidu|twitter|facebook|linkedin|slack|whatsapp/i;
  return botRegex.test(ua);
}

export const trackingRouter = new Hono()
  .use("*", trackingRateLimiter)
  // Tracking pixel — email open
  .get("/open/:publicTrackingId", async (c) => {
    const { publicTrackingId } = c.req.param();

    const [email] = await db
      .select()
      .from(schema.emails)
      .where(eq(schema.emails.publicTrackingId, publicTrackingId));

    if (email) {
      const ua = c.req.header("user-agent") || "";
      const ip = c.req.header("cf-connecting-ip") || c.req.header("x-forwarded-for") || "unknown";
      const { browser, os, deviceType } = parseUserAgent(ua);
      const suspicious = isBot(ua);

      // Check if unique open
      const existingEvents = await db
        .select()
        .from(schema.emailEvents)
        .where(and(eq(schema.emailEvents.emailId, email.id), eq(schema.emailEvents.type, "open")));

      const isUnique = !existingEvents.some(e => e.ipAddress === ip && e.userAgent === ua);

      await db.insert(schema.emailEvents).values({
        id: randomUUID(),
        emailId: email.id,
        userId: email.userId,
        type: "open",
        ipAddress: ip,
        userAgent: ua,
        browser,
        os,
        deviceType,
        isSuspicious: suspicious,
      });

      // Update engagement score and stats
      const totalOpens = email.totalOpens + 1;
      const uniqueOpens = isUnique ? email.uniqueOpens + 1 : email.uniqueOpens;
      let score = email.engagementScore;
      if (isUnique && !suspicious) {
        if (uniqueOpens === 1) score += 10;
        else score = Math.min(score + 5, 100);
      }

      await db.update(schema.emails)
        .set({
          engagementScore: score,
          totalOpens,
          uniqueOpens,
          firstOpenAt: email.firstOpenAt || new Date()
        })
        .where(eq(schema.emails.id, email.id));

      // Notification only for unique non-suspicious opens
      if (isUnique && !suspicious) {
        await db.insert(schema.notifications).values({
          id: randomUUID(),
          userId: email.userId,
          emailId: email.id,
          type: "open",
          title: "Email opened!",
          body: `Your email to ${email.to} was just opened.`,
          read: false,
        });
      }
    }

    c.header("Content-Type", "image/gif");
    c.header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
    c.header("Pragma", "no-cache");
    return c.body(TRACKING_PIXEL);
  })

  // Link click tracking — redirect
  .get("/click/:shortCode", async (c) => {
    const { shortCode } = c.req.param();

    const [link] = await db
      .select()
      .from(schema.trackedLinks)
      .where(eq(schema.trackedLinks.shortCode, shortCode));

    if (!link) {
      return c.text("Not found", 404);
    }

    const ua = c.req.header("user-agent") || "";
    const ip = c.req.header("cf-connecting-ip") || c.req.header("x-forwarded-for") || "unknown";
    const { browser, os, deviceType } = parseUserAgent(ua);
    const suspicious = isBot(ua);

    await db.insert(schema.emailEvents).values({
      id: randomUUID(),
      emailId: link.emailId,
      userId: link.userId,
      type: "click",
      url: link.originalUrl,
      ipAddress: ip,
      userAgent: ua,
      browser,
      os,
      deviceType,
      isSuspicious: suspicious,
    });

    await db.update(schema.trackedLinks)
      .set({ clickCount: link.clickCount + 1 })
      .where(eq(schema.trackedLinks.shortCode, shortCode));

    // Update email engagement score
    const [email] = await db
      .select()
      .from(schema.emails)
      .where(eq(schema.emails.id, link.emailId));

    if (email) {
      if (!suspicious) {
        await db.update(schema.emails)
          .set({ engagementScore: Math.min(email.engagementScore + 10, 100) })
          .where(eq(schema.emails.id, email.id));
      }

      await db.insert(schema.notifications).values({
        id: randomUUID(),
        userId: link.userId,
        emailId: link.emailId,
        type: "click",
        title: "Link clicked!",
        body: `A link in your email to ${email.to} was clicked.`,
        read: false,
      });
    }

    return c.redirect(link.originalUrl);
  })

  // Resume view tracking
  .get("/resume/:publicTrackingId", async (c) => {
    const { publicTrackingId } = c.req.param();

    const [resume] = await db
      .select()
      .from(schema.resumes)
      .where(eq(schema.resumes.publicTrackingId, publicTrackingId));

    if (!resume) return c.redirect("/");

    const ua = c.req.header("user-agent") || "";
    const ip = c.req.header("cf-connecting-ip") || c.req.header("x-forwarded-for") || "unknown";
    const suspicious = isBot(ua);

    await db.insert(schema.emailEvents).values({
      id: randomUUID(),
      emailId: "",
      userId: resume.userId,
      type: "resume_view",
      url: resume.url,
      ipAddress: ip,
      userAgent: ua,
      isSuspicious: suspicious,
    });

    await db.update(schema.resumes)
      .set({ totalViews: resume.totalViews + 1 })
      .where(eq(schema.resumes.id, resume.id));

    if (!suspicious) {
      await db.insert(schema.notifications).values({
        id: randomUUID(),
        userId: resume.userId,
        type: "resume_view",
        title: "Resume viewed!",
        body: `Someone viewed your resume "${resume.filename}".`,
        read: false,
      });
    }

    return c.redirect(resume.url);
  });
