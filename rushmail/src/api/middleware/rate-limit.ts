import { createMiddleware } from "hono/factory";
import { logSecurityEvent } from "../utils/logger.js";

// A simple in-memory store designed to be easily replaced by Redis.
class MemoryStore {
  private store = new Map<string, { count: number; resetAt: number }>();

  async increment(key: string, windowMs: number): Promise<{ count: number; resetAt: number }> {
    const now = Date.now();
    let record = this.store.get(key);

    if (!record || record.resetAt <= now) {
      record = { count: 0, resetAt: now + windowMs };
    }

    record.count += 1;
    this.store.set(key, record);
    return record;
  }

  cleanup() {
    const now = Date.now();
    for (const [key, value] of this.store.entries()) {
      if (value.resetAt <= now) {
        this.store.delete(key);
      }
    }
  }
}

export const rateLimitStore = new MemoryStore();
setInterval(() => rateLimitStore.cleanup(), 60000); // Cleanup every minute

export function rateLimit(opts: {
  keyPrefix: string;
  limit: number;
  windowMs: number;
  getKey: (c: any) => string | undefined;
  errorMessage?: string;
  logAsAbuse?: boolean;
}) {
  return createMiddleware(async (c, next) => {
    const id = opts.getKey(c);
    if (!id) return next();

    const key = `${opts.keyPrefix}:${id}`;
    const { count, resetAt } = await rateLimitStore.increment(key, opts.windowMs);

    c.header("X-RateLimit-Limit", opts.limit.toString());
    c.header("X-RateLimit-Remaining", Math.max(0, opts.limit - count).toString());
    c.header("X-RateLimit-Reset", Math.ceil(resetAt / 1000).toString());

    if (count > opts.limit) {
      if (opts.logAsAbuse) {
        await logSecurityEvent({
          eventType: "rate_limit",
          severity: "MED",
          ipAddress: c.req.header("cf-connecting-ip") || c.req.header("x-forwarded-for"),
          userAgent: c.req.header("user-agent"),
          userId: c.get("user")?.id,
          metadata: { keyPrefix: opts.keyPrefix, id, limit: opts.limit },
        });
      }
      return c.json({ message: opts.errorMessage || "Too many requests" }, 429);
    }

    return next();
  });
}

// Pre-configured limiters
export const ipRateLimiter = rateLimit({
  keyPrefix: "ip_global",
  limit: 200,
  windowMs: 60 * 1000, // 200 per minute per IP globally
  getKey: (c) => c.req.header("cf-connecting-ip") || "unknown",
  errorMessage: "Too many requests from this IP",
  logAsAbuse: true,
});

export const authRateLimiter = rateLimit({
  keyPrefix: "auth_attempt",
  limit: 10,
  windowMs: 15 * 60 * 1000, // 10 per 15 minutes per IP
  getKey: (c) => c.req.header("cf-connecting-ip") || "unknown",
  errorMessage: "Too many authentication attempts",
  logAsAbuse: true,
});

export const trackingRateLimiter = rateLimit({
  keyPrefix: "track_ip",
  limit: 20,
  windowMs: 60 * 1000, // max 20 tracking events per minute per IP
  getKey: (c) => c.req.header("cf-connecting-ip") || "unknown",
  errorMessage: "Too many tracking events",
  logAsAbuse: true,
});

export const emailSendingQuotas = createMiddleware(async (c, next) => {
  const user = c.get("user");
  if (!user) return next();

  const userId = user.id;

  // Check 1 per minute
  const minResult = await rateLimitStore.increment(`email_min:${userId}`, 60 * 1000);
  if (minResult.count > 1) {
    return c.json({ message: "You can only send 1 email per minute." }, 429);
  }

  // Check 5 per hour
  const hourResult = await rateLimitStore.increment(`email_hr:${userId}`, 60 * 60 * 1000);
  if (hourResult.count > 5) {
    return c.json({ message: "Hourly limit reached (5 emails/hr)." }, 429);
  }

  // Check 10 per day
  const dayResult = await rateLimitStore.increment(`email_day:${userId}`, 24 * 60 * 60 * 1000);
  if (dayResult.count > 10) {
    return c.json({ message: "Daily limit reached (10 emails/day)." }, 429);
  }

  return next();
});
