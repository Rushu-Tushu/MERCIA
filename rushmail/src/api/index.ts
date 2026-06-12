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
import { oauthRouter } from './routes/oauth.js';
import { ipRateLimiter } from './middleware/rate-limit.js';
import { cloudflareOriginProtection, securityHeaders } from './middleware/security.js';
import { logSecurityEvent } from './utils/logger.js';

const app = new Hono()
  .use("*", cloudflareOriginProtection)
  .use("*", securityHeaders)
  .use("*", ipRateLimiter)
  .use("*", cors({ origin: (origin) => origin ?? "*", credentials: true }))
  .onError(async (err, c) => {
    console.error("Unhandled Error:", err);
    await logSecurityEvent({
      eventType: "unhandled_error",
      severity: "MED",
      ipAddress: c.req.header("cf-connecting-ip") || "unknown",
      userAgent: c.req.header("user-agent"),
      metadata: { error: err.message, path: c.req.path },
    });

    // Strip stack traces in production
    if (process.env.NODE_ENV === "production") {
      return c.json({ message: "Internal Server Error" }, 500);
    }
    return c.json({ message: err.message, stack: err.stack }, 500);
  })
  .on(["GET", "POST"], "/api/auth/*", (c) => auth.handler(c.req.raw))
  .basePath("api")
  .get("/health", (c) => c.json({ status: "ok" }, 200))
  .route("/emails", emailsRouter)
  .route("/track", trackingRouter)
  .route("/analytics", analyticsRouter)
  .route("/notifications", notificationsRouter)
  .route("/templates", templatesRouter)
  .route("/resumes", resumesRouter)
  .route("/connected-accounts", connectedAccountsRouter)
  .route("/oauth", oauthRouter);

export type AppType = typeof app;
export default app;
