import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export * from './auth-schema.js';

// ─── Emails ───────────────────────────────────────────────────────────────────
export const emails = sqliteTable("emails", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  to: text("to").notNull(),
  subject: text("subject").notNull(),
  body: text("body").notNull(),
  templateId: text("template_id"),
  status: text("status").notNull().default("sent"), // sent | draft | scheduled
  scheduledAt: integer("scheduled_at", { mode: "timestamp" }),
  sentAt: integer("sent_at", { mode: "timestamp" }),
  trackingId: text("tracking_id").notNull().unique(),
  engagementScore: integer("engagement_score").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// ─── Email Events ──────────────────────────────────────────────────────────────
export const emailEvents = sqliteTable("email_events", {
  id: text("id").primaryKey(),
  emailId: text("email_id").notNull(),
  userId: text("user_id").notNull(),
  type: text("type").notNull(), // open | click | resume_view | portfolio_click | resume_download
  url: text("url"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  deviceType: text("device_type"),
  browser: text("browser"),
  os: text("os"),
  country: text("country"),
  city: text("city"),
  metadata: text("metadata"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// ─── Resumes ───────────────────────────────────────────────────────────────────
export const resumes = sqliteTable("resumes", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  filename: text("filename").notNull(),
  url: text("url").notNull(),
  trackingId: text("tracking_id").notNull().unique(),
  totalViews: integer("total_views").notNull().default(0),
  totalDownloads: integer("total_downloads").notNull().default(0),
  totalTimeSpent: integer("total_time_spent").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// ─── Templates ────────────────────────────────────────────────────────────────
export const templates = sqliteTable("templates", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  subject: text("subject").notNull(),
  body: text("body").notNull(),
  category: text("category").notNull().default("general"),
  usageCount: integer("usage_count").notNull().default(0),
  openRate: real("open_rate").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// ─── Notifications ────────────────────────────────────────────────────────────
export const notifications = sqliteTable("notifications", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  emailId: text("email_id"),
  type: text("type").notNull(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  read: integer("read", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// ─── Connected Accounts ───────────────────────────────────────────────────────
export const connectedAccounts = sqliteTable("connected_accounts", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  provider: text("provider").notNull(), // "gmail" | "outlook"
  providerEmail: text("provider_email").notNull(),
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token"),
  expiresAt: integer("expires_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// ─── Tracked Links ────────────────────────────────────────────────────────────
export const trackedLinks = sqliteTable("tracked_links", {
  id: text("id").primaryKey(),
  emailId: text("email_id").notNull(),
  userId: text("user_id").notNull(),
  originalUrl: text("original_url").notNull(),
  shortCode: text("short_code").notNull().unique(),
  clickCount: integer("click_count").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});
