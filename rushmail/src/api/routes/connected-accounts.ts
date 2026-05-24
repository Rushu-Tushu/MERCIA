import { Hono } from "hono";
import { db } from "../database/index";
import { account } from "../database/auth-schema";
import { eq, and } from "drizzle-orm";
import { requireAuth, authMiddleware } from "../middleware/auth";

export const connectedAccountsRouter = new Hono()
  .use("*", authMiddleware)
  .get("/", requireAuth, async (c) => {
    const user = c.get("user")!;
    const accounts = await db
      .select({
        id: account.id,
        provider: account.providerId,
        scope: account.scope,
        hasRefreshToken: account.refreshToken,
      })
      .from(account)
      .where(and(eq(account.userId, user.id), eq(account.providerId, "google")));

    return c.json({
      accounts: accounts.map(a => ({
        id: a.id,
        provider: "gmail",
        providerEmail: user.email,  // use actual email from user table
        hasGmailScope: a.scope?.includes("gmail.send") ?? false,
        connected: true,
      })),
    });
  });
