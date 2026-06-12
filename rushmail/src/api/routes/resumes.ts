import { Hono } from "hono";
import { db } from '../database/index.js';
import * as schema from '../database/schema.js';
import { eq, desc, and, count } from "drizzle-orm";
import { requireAuth, authMiddleware } from '../middleware/auth.js';
import { randomUUID } from "crypto";
import { generatePublicId } from "../utils/crypto.js";
import { logAudit, logSecurityEvent } from "../utils/logger.js";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const createResumeSchema = z.object({
  filename: z.string().min(1).max(255),
  url: z.string().url().max(1000),
});

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
  .post("/", requireAuth, zValidator("json", createResumeSchema), async (c) => {
    const user = c.get("user")!;
    const { filename, url } = c.req.valid("json");

    // Resource Exhaustion Limit: Max 5 resumes
    const [result] = await db
      .select({ count: count() })
      .from(schema.resumes)
      .where(eq(schema.resumes.userId, user.id));

    if (result.count >= 5) {
      await logSecurityEvent({
        eventType: "resource_exhaustion_attempt",
        severity: "LOW",
        userId: user.id,
        metadata: { resource: "resumes" },
      });
      return c.json({ message: "You have reached the maximum limit of 5 resumes." }, 403);
    }

    const publicTrackingId = generatePublicId();
    const baseUrl = process.env.WEBSITE_URL?.replace(/\/$/, "") || "http://localhost:4200";
    const resumeId = randomUUID();

    const [resume] = await db.insert(schema.resumes).values({
      id: resumeId,
      userId: user.id,
      filename,
      url,
      publicTrackingId,
    }).returning();

    await logAudit({
      userId: user.id,
      actionType: "create_resume",
      resourceId: resumeId,
      status: "success",
    });

    const trackingUrl = `${baseUrl}/api/track/resume/${publicTrackingId}`;

    return c.json({ resume, trackingUrl }, 201);
  })
  .delete("/:id", requireAuth, async (c) => {
    const user = c.get("user")!;
    const { id } = c.req.param();

    // BOLA Fix: Enforce userId check
    const result = await db.delete(schema.resumes)
      .where(and(eq(schema.resumes.id, id), eq(schema.resumes.userId, user.id)))
      .returning();

    if (result.length === 0) {
      await logSecurityEvent({
        eventType: "bola_attempt",
        severity: "HIGH",
        userId: user.id,
        metadata: { resource: "resumes", id },
      });
      return c.json({ message: "Not found or forbidden" }, 404);
    }

    await logAudit({
      userId: user.id,
      actionType: "delete_resume",
      resourceId: id,
      status: "success",
    });

    return c.json({ success: true }, 200);
  });
