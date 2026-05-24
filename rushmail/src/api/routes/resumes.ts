import { Hono } from "hono";
import { db } from '../database/index.js';
import * as schema from '../database/schema.js';
import { eq, desc } from "drizzle-orm";
import { requireAuth, authMiddleware } from '../middleware/auth.js';
import { randomUUID } from "crypto";

export const resumesRouter = new Hono()
  .use("*", authMiddleware)
  .get("/", requireAuth, async (c) => {
    const user = c.get("user")!;
    const resumeList = await db
      .select()
      .from(schema.resumes)
      .where(eq(schema.resumes.userId, user.id))
      .orderBy(desc(schema.resumes.createdAt));
    return c.json({ resumes: resumeList }, 200);
  })
  .post("/", requireAuth, async (c) => {
    const user = c.get("user")!;
    const body = await c.req.json();
    const { filename, url } = body;

    if (!filename || !url) {
      return c.json({ message: "filename and url are required" }, 400);
    }

    const trackingId = randomUUID();
    const baseUrl = process.env.WEBSITE_URL?.replace(/\/$/, "") || "http://localhost:4200";

    const [resume] = await db.insert(schema.resumes).values({
      id: randomUUID(),
      userId: user.id,
      filename,
      url,
      trackingId,
    }).returning();

    const trackingUrl = `${baseUrl}/api/track/resume/${trackingId}`;

    return c.json({ resume, trackingUrl }, 201);
  })
  .delete("/:id", requireAuth, async (c) => {
    const user = c.get("user")!;
    const { id } = c.req.param();
    await db.delete(schema.resumes).where(eq(schema.resumes.id, id));
    return c.json({ success: true }, 200);
  });
