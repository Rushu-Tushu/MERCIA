import { Hono } from "hono";
import { db } from "../database";
import * as schema from "../database/schema";
import { eq, desc, and } from "drizzle-orm";
import { requireAuth, authMiddleware } from "../middleware/auth";
import { randomUUID } from "crypto";

export const notificationsRouter = new Hono()
  .use("*", authMiddleware)
  .get("/", requireAuth, async (c) => {
    const user = c.get("user")!;
    const notifs = await db
      .select()
      .from(schema.notifications)
      .where(eq(schema.notifications.userId, user.id))
      .orderBy(desc(schema.notifications.createdAt))
      .limit(50);
    const unread = notifs.filter(n => !n.read).length;
    return c.json({ notifications: notifs, unread }, 200);
  })
  .post("/read-all", requireAuth, async (c) => {
    const user = c.get("user")!;
    await db.update(schema.notifications)
      .set({ read: true })
      .where(eq(schema.notifications.userId, user.id));
    return c.json({ success: true }, 200);
  })
  .post("/:id/read", requireAuth, async (c) => {
    const user = c.get("user")!;
    const { id } = c.req.param();
    await db.update(schema.notifications)
      .set({ read: true })
      .where(and(eq(schema.notifications.id, id), eq(schema.notifications.userId, user.id)));
    return c.json({ success: true }, 200);
  });
