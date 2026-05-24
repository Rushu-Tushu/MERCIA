import { Hono } from "hono";
import { db } from '../database/index.js';
import * as schema from '../database/schema.js';
import { eq, and } from "drizzle-orm";
import { requireAuth, authMiddleware } from '../middleware/auth.js';
import { randomUUID } from "crypto";

// ─── Token refresh helpers ────────────────────────────────────────────────────

export async function refreshGmailToken(refreshToken: string): Promise<{ accessToken: string; expiresAt: Date }> {
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

export async function refreshOutlookToken(refreshToken: string): Promise<{ accessToken: string; expiresAt: Date }> {
  const tenantId = process.env.MICROSOFT_TENANT_ID || "common";
  const res = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.MICROSOFT_CLIENT_ID!,
      client_secret: process.env.MICROSOFT_CLIENT_SECRET!,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
      scope: "https://graph.microsoft.com/Mail.Send https://graph.microsoft.com/User.Read offline_access",
    }),
  });
  const data = await res.json() as any;
  if (!res.ok || data.error) throw new Error(data.error_description || "Failed to refresh Outlook token");
  return {
    accessToken: data.access_token,
    expiresAt: new Date(Date.now() + data.expires_in * 1000),
  };
}

// Get a valid access token for a connected account (auto-refreshes if expired)
export async function getValidToken(account: typeof schema.connectedAccounts.$inferSelect): Promise<string> {
  const now = new Date();
  const bufferMs = 5 * 60 * 1000; // 5 min buffer

  if (!account.expiresAt || account.expiresAt.getTime() - bufferMs > now.getTime()) {
    return account.accessToken;
  }

  // Need to refresh
  if (!account.refreshToken) throw new Error("No refresh token available — user must reconnect");

  let refreshed: { accessToken: string; expiresAt: Date };
  if (account.provider === "gmail") {
    refreshed = await refreshGmailToken(account.refreshToken);
  } else {
    refreshed = await refreshOutlookToken(account.refreshToken);
  }

  await db.update(schema.connectedAccounts)
    .set({ accessToken: refreshed.accessToken, expiresAt: refreshed.expiresAt })
    .where(eq(schema.connectedAccounts.id, account.id));

  return refreshed.accessToken;
}

// ─── Router ───────────────────────────────────────────────────────────────────

export const oauthRouter = new Hono()
  .use("*", authMiddleware)

  // ── Gmail: initiate ──────────────────────────────────────────────────────────
  .get("/gmail", requireAuth, async (c) => {
    if (!process.env.GOOGLE_CLIENT_ID) {
      return c.json({ message: "Google OAuth not configured. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to .env" }, 501);
    }
    const baseUrl = process.env.WEBSITE_URL?.replace(/\/$/, "") || "http://localhost:4200";
    const redirectUri = `${baseUrl}/api/oauth/gmail/callback`;

    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/userinfo.email",
      access_type: "offline",
      prompt: "consent",
    });
    return c.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
  })

  // ── Gmail: callback ──────────────────────────────────────────────────────────
  .get("/gmail/callback", requireAuth, async (c) => {
    const user = c.get("user")!;
    const code = c.req.query("code");
    const error = c.req.query("error");

    const baseUrl = process.env.WEBSITE_URL?.replace(/\/$/, "") || "http://localhost:4200";
    const redirectUri = `${baseUrl}/api/oauth/gmail/callback`;

    if (error || !code) {
      return c.redirect(`${baseUrl}/settings?oauth=error&provider=gmail`);
    }

    try {
      // Exchange code for tokens
      const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code,
          client_id: process.env.GOOGLE_CLIENT_ID!,
          client_secret: process.env.GOOGLE_CLIENT_SECRET!,
          redirect_uri: redirectUri,
          grant_type: "authorization_code",
        }),
      });
      const tokens = await tokenRes.json() as any;
      if (!tokenRes.ok || tokens.error) throw new Error(tokens.error_description || "Token exchange failed");

      // Get user email
      const userRes = await fetch("https://www.googleapis.com/oauth2/v1/userinfo", {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      });
      const userInfo = await userRes.json() as any;
      const providerEmail = userInfo.email;

      // Upsert connected account
      const existing = await db.select().from(schema.connectedAccounts)
        .where(and(
          eq(schema.connectedAccounts.userId, user.id),
          eq(schema.connectedAccounts.provider, "gmail")
        )).get();

      const expiresAt = tokens.expires_in ? new Date(Date.now() + tokens.expires_in * 1000) : null;

      if (existing) {
        await db.update(schema.connectedAccounts).set({
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token || existing.refreshToken,
          expiresAt,
          providerEmail,
        }).where(eq(schema.connectedAccounts.id, existing.id));
      } else {
        await db.insert(schema.connectedAccounts).values({
          id: randomUUID(),
          userId: user.id,
          provider: "gmail",
          providerEmail,
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token || null,
          expiresAt,
        });
      }

      return c.redirect(`${baseUrl}/settings?oauth=success&provider=gmail`);
    } catch (err: any) {
      console.error("Gmail OAuth error:", err);
      return c.redirect(`${baseUrl}/settings?oauth=error&provider=gmail&msg=${encodeURIComponent(err.message)}`);
    }
  })

  // ── Outlook: initiate ────────────────────────────────────────────────────────
  .get("/outlook", requireAuth, async (c) => {
    if (!process.env.MICROSOFT_CLIENT_ID) {
      return c.json({ message: "Microsoft OAuth not configured. Add MICROSOFT_CLIENT_ID and MICROSOFT_CLIENT_SECRET to .env" }, 501);
    }
    const baseUrl = process.env.WEBSITE_URL?.replace(/\/$/, "") || "http://localhost:4200";
    const redirectUri = `${baseUrl}/api/oauth/outlook/callback`;
    const tenantId = process.env.MICROSOFT_TENANT_ID || "common";

    const params = new URLSearchParams({
      client_id: process.env.MICROSOFT_CLIENT_ID,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "https://graph.microsoft.com/Mail.Send https://graph.microsoft.com/User.Read offline_access",
      response_mode: "query",
    });
    return c.redirect(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize?${params}`);
  })

  // ── Outlook: callback ────────────────────────────────────────────────────────
  .get("/outlook/callback", requireAuth, async (c) => {
    const user = c.get("user")!;
    const code = c.req.query("code");
    const error = c.req.query("error");

    const baseUrl = process.env.WEBSITE_URL?.replace(/\/$/, "") || "http://localhost:4200";
    const tenantId = process.env.MICROSOFT_TENANT_ID || "common";
    const redirectUri = `${baseUrl}/api/oauth/outlook/callback`;

    if (error || !code) {
      return c.redirect(`${baseUrl}/settings?oauth=error&provider=outlook`);
    }

    try {
      const tokenRes = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code,
          client_id: process.env.MICROSOFT_CLIENT_ID!,
          client_secret: process.env.MICROSOFT_CLIENT_SECRET!,
          redirect_uri: redirectUri,
          grant_type: "authorization_code",
          scope: "https://graph.microsoft.com/Mail.Send https://graph.microsoft.com/User.Read offline_access",
        }),
      });
      const tokens = await tokenRes.json() as any;
      if (!tokenRes.ok || tokens.error) throw new Error(tokens.error_description || "Token exchange failed");

      // Get user email from Microsoft Graph
      const userRes = await fetch("https://graph.microsoft.com/v1.0/me", {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      });
      const userInfo = await userRes.json() as any;
      const providerEmail = userInfo.mail || userInfo.userPrincipalName;

      const existing = await db.select().from(schema.connectedAccounts)
        .where(and(
          eq(schema.connectedAccounts.userId, user.id),
          eq(schema.connectedAccounts.provider, "outlook")
        )).get();

      const expiresAt = tokens.expires_in ? new Date(Date.now() + tokens.expires_in * 1000) : null;

      if (existing) {
        await db.update(schema.connectedAccounts).set({
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token || existing.refreshToken,
          expiresAt,
          providerEmail,
        }).where(eq(schema.connectedAccounts.id, existing.id));
      } else {
        await db.insert(schema.connectedAccounts).values({
          id: randomUUID(),
          userId: user.id,
          provider: "outlook",
          providerEmail,
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token || null,
          expiresAt,
        });
      }

      return c.redirect(`${baseUrl}/settings?oauth=success&provider=outlook`);
    } catch (err: any) {
      console.error("Outlook OAuth error:", err);
      return c.redirect(`${baseUrl}/settings?oauth=error&provider=outlook&msg=${encodeURIComponent(err.message)}`);
    }
  });
