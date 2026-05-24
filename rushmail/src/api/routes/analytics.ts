import { Hono } from "hono";
import { db } from "../database/index";
import * as schema from "../database/schema";
import { eq, desc, and, gte, count, sql } from "drizzle-orm";
import { requireAuth, authMiddleware } from "../middleware/auth";
import { subDays, startOfDay, format } from "date-fns";

export const analyticsRouter = new Hono()
  .use("*", authMiddleware)
  .get("/dashboard", requireAuth, async (c) => {
    const user = c.get("user")!;

    const userEmails = await db
      .select()
      .from(schema.emails)
      .where(eq(schema.emails.userId, user.id));

    const emailIds = userEmails.map(e => e.id);

    let allEvents: typeof schema.emailEvents.$inferSelect[] = [];
    if (emailIds.length > 0) {
      allEvents = await db
        .select()
        .from(schema.emailEvents)
        .where(eq(schema.emailEvents.userId, user.id));
    }

    const totalEmails = userEmails.filter(e => e.status === "sent").length;
    const opens = allEvents.filter(e => e.type === "open");
    const clicks = allEvents.filter(e => e.type === "click");
    const resumeViews = allEvents.filter(e => e.type === "resume_view");
    const portfolioClicks = allEvents.filter(e => e.type === "portfolio_click");

    const uniqueOpens = new Set(opens.map(e => e.emailId)).size;
    const openRate = totalEmails > 0 ? (uniqueOpens / totalEmails) * 100 : 0;
    const clickRate = totalEmails > 0 ? (new Set(clicks.map(e => e.emailId)).size / totalEmails) * 100 : 0;

    // Last 7 days activity
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = subDays(new Date(), 6 - i);
      const label = format(d, "MMM d");
      const dayStart = startOfDay(d).getTime();
      const dayEnd = dayStart + 86400000;
      return {
        date: label,
        opens: opens.filter(e => {
          const t = e.createdAt instanceof Date ? e.createdAt.getTime() : new Date(e.createdAt).getTime();
          return t >= dayStart && t < dayEnd;
        }).length,
        clicks: clicks.filter(e => {
          const t = e.createdAt instanceof Date ? e.createdAt.getTime() : new Date(e.createdAt).getTime();
          return t >= dayStart && t < dayEnd;
        }).length,
      };
    });

    // Recent activity feed
    const recentEvents = allEvents
      .sort((a, b) => {
        const at = a.createdAt instanceof Date ? a.createdAt.getTime() : new Date(a.createdAt).getTime();
        const bt = b.createdAt instanceof Date ? b.createdAt.getTime() : new Date(b.createdAt).getTime();
        return bt - at;
      })
      .slice(0, 20)
      .map(e => ({
        ...e,
        emailSubject: userEmails.find(em => em.id === e.emailId)?.subject || "Unknown",
        emailTo: userEmails.find(em => em.id === e.emailId)?.to || "Unknown",
      }));

    // Avg engagement score
    const avgScore = userEmails.length > 0
      ? Math.round(userEmails.reduce((sum, e) => sum + e.engagementScore, 0) / userEmails.length)
      : 0;

    // Hourly heatmap (hour 0-23)
    const hourlyData = Array.from({ length: 24 }, (_, h) => ({
      hour: h,
      count: opens.filter(e => {
        const d = e.createdAt instanceof Date ? e.createdAt : new Date(e.createdAt);
        return d.getHours() === h;
      }).length,
    }));

    return c.json({
      totalEmails,
      totalOpens: opens.length,
      uniqueOpens,
      openRate: Math.round(openRate * 10) / 10,
      clickRate: Math.round(clickRate * 10) / 10,
      resumeViews: resumeViews.length,
      portfolioClicks: portfolioClicks.length,
      avgEngagementScore: avgScore,
      last7Days,
      recentEvents,
      hourlyData,
    }, 200);
  })
  .get("/email/:id", requireAuth, async (c) => {
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

    // Ghosting detection
    const opens = events.filter(e => e.type === "open");
    const now = Date.now();
    const lastOpen = opens.length > 0
      ? (opens[0].createdAt instanceof Date ? opens[0].createdAt.getTime() : new Date(opens[0].createdAt).getTime())
      : null;
    const daysSinceLastOpen = lastOpen ? (now - lastOpen) / (1000 * 60 * 60 * 24) : null;

    let ghostingStatus = "No Data";
    if (opens.length >= 2 && daysSinceLastOpen && daysSinceLastOpen > 3) {
      ghostingStatus = "Possibly Ghosting";
    } else if (opens.length >= 1 && events.filter(e => e.type !== "open").length > 0) {
      ghostingStatus = "Interested";
    } else if (opens.length >= 1) {
      ghostingStatus = "Neutral";
    }

    return c.json({ email, events, links, ghostingStatus }, 200);
  });
