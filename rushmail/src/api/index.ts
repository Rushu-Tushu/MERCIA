/// <reference path="./types.d.ts" />
import { Hono } from "hono";
import { cors } from "hono/cors";
import { auth } from './auth.js';
import { authMiddleware } from './middleware/auth.js';
import { emailsRouter } from './routes/emails.js';
import { trackingRouter } from './routes/tracking.js';
import { analyticsRouter } from './routes/analytics.js';
import { notificationsRouter } from './routes/notifications.js';
import { templatesRouter } from './routes/templates.js';
import { resumesRouter } from './routes/resumes.js';
import { connectedAccountsRouter } from './routes/connected-accounts.js';

const app = new Hono()
  .use(cors({ origin: (origin) => origin ?? "*", credentials: true }))
  .on(["GET", "POST"], "/api/auth/*", (c) => auth.handler(c.req.raw))
  .basePath("api")
  .get("/health", (c) => c.json({ status: "ok" }, 200))
  .route("/emails", emailsRouter)
  .route("/track", trackingRouter)
  .route("/analytics", analyticsRouter)
  .route("/notifications", notificationsRouter)
  .route("/templates", templatesRouter)
  .route("/resumes", resumesRouter)
  .route("/connected-accounts", connectedAccountsRouter);

export type AppType = typeof app;
export default app;
