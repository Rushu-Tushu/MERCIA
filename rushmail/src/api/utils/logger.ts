import { db } from "../database/index.js";
import * as schema from "../database/schema.js";
import { randomUUID } from "crypto";

export async function logAudit(params: {
  userId?: string;
  email?: string;
  actionType: string;
  resourceId?: string;
  status: "success" | "failure";
  ipAddress?: string;
  userAgent?: string;
  metadata?: any;
}) {
  try {
    // Fire and forget approach to prevent blocking
    Promise.resolve(db.insert(schema.auditLogs).values({
      id: randomUUID(),
      userId: params.userId || null,
      email: params.email || null,
      actionType: params.actionType,
      resourceId: params.resourceId || null,
      status: params.status,
      ipAddress: params.ipAddress || null,
      userAgent: params.userAgent || null,
      metadata: params.metadata ? JSON.stringify(params.metadata) : null,
    })).catch(err => console.error("Audit log failed:", err));
  } catch (e) {
    console.error(e);
  }
}

export async function logSecurityEvent(params: {
  userId?: string;
  eventType: "rate_limit" | "bola_attempt" | "invalid_oauth" | "bot_traffic" | "origin_bypass" | string;
  severity: "LOW" | "MED" | "HIGH" | "CRITICAL";
  ipAddress?: string;
  userAgent?: string;
  metadata?: any;
}) {
  try {
    Promise.resolve(db.insert(schema.securityEvents).values({
      id: randomUUID(),
      userId: params.userId || null,
      eventType: params.eventType,
      severity: params.severity,
      ipAddress: params.ipAddress || null,
      userAgent: params.userAgent || null,
      metadata: params.metadata ? JSON.stringify(params.metadata) : null,
    })).catch(err => console.error("Security event log failed:", err));
  } catch (e) {
    console.error(e);
  }
}
