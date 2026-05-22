import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./database";

export const auth = betterAuth({
  basePath: "/api/auth",
  baseURL: process.env.NODE_ENV === "development" ? "http://localhost:4200" : process.env.WEBSITE_URL,
  database: drizzleAdapter(db, { provider: "sqlite" }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      scope: [
        "openid",
        "email",
        "profile",
        "https://www.googleapis.com/auth/gmail.send",
      ],
      accessType: "offline",
      prompt: "consent",
    },
  },
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: ["*"],
});
