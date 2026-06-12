import { sqliteTable, text, integer, real, index } from "drizzle-orm/sqlite-core";

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
  publicTrackingId: text("public_tracking_id").notNull().unique(),
  engagementScore: integer("engagement_score").notNull().default(0),
  firstOpenAt: integer("first_open_at", { mode: "timestamp" }),
  uniqueOpens: integer("unique_opens").notNull().default(0),
  totalOpens: integer("total_opens").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
}, (table) => [
  index("emails_user_id_idx").on(table.userId),
  index("emails_public_tracking_id_idx").on(table.publicTrackingId)
]);

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
  isSuspicious: integer("is_suspicious", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
}, (table) => [
  index("email_events_email_id_idx").on(table.emailId),
  index("email_events_user_id_idx").on(table.userId)
]);

// ─── Resumes ───────────────────────────────────────────────────────────────────
export const resumes = sqliteTable("resumes", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  filename: text("filename").notNull(),
  url: text("url").notNull(),
  publicTrackingId: text("public_tracking_id").notNull().unique(),
  totalViews: integer("total_views").notNull().default(0),
  totalDownloads: integer("total_downloads").notNull().default(0),
  totalTimeSpent: integer("total_time_spent").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
}, (table) => [
  index("resumes_user_id_idx").on(table.userId),
  index("resumes_public_tracking_id_idx").on(table.publicTrackingId)
]);

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
}, (table) => [
  index("templates_user_id_idx").on(table.userId)
]);

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
}, (table) => [
  index("notifications_user_id_idx").on(table.userId)
]);

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
}, (table) => [
  index("connected_accounts_user_id_idx").on(table.userId)
]);

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
}, (table) => [
  index("tracked_links_email_id_idx").on(table.emailId),
  index("tracked_links_short_code_idx").on(table.shortCode)
]);

// ─── Audit Logs ───────────────────────────────────────────────────────────────
export const auditLogs = sqliteTable("audit_logs", {
  id: text("id").primaryKey(),
  userId: text("user_id"),
  email: text("email"),
  actionType: text("action_type").notNull(),
  resourceId: text("resource_id"),
  status: text("status").notNull(), // "success" | "failure"
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  metadata: text("metadata"), // JSON string
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
}, (table) => [
  index("audit_logs_user_id_idx").on(table.userId)
]);

// ─── Security Events ──────────────────────────────────────────────────────────
export const securityEvents = sqliteTable("security_events", {
  id: text("id").primaryKey(),
  userId: text("user_id"),
  eventType: text("event_type").notNull(), // "rate_limit" | "bola_attempt" | "invalid_oauth" | "bot_traffic"
  severity: text("severity").notNull(), // "LOW" | "MED" | "HIGH" | "CRITICAL"
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  metadata: text("metadata"), // JSON string
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
}, (table) => [
  index("security_events_created_at_idx").on(table.createdAt)
]);
