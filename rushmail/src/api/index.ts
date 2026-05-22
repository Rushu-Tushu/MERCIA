import { Hono } from "hono";
import { cors } from "hono/cors";
import { auth } from "./auth";
import { authMiddleware } from "./middleware/auth";
import { emailsRouter } from "./routes/emails";
import { trackingRouter } from "./routes/tracking";
import { analyticsRouter } from "./routes/analytics";
import { notificationsRouter } from "./routes/notifications";
import { templatesRouter } from "./routes/templates";
import { resumesRouter } from "./routes/resumes";
import { connectedAccountsRouter } from "./routes/connected-accounts";

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
