import { createMiddleware } from "hono/factory";
import { secureHeaders as honoSecureHeaders } from "hono/secure-headers";
import { logSecurityEvent } from "../utils/logger.js";

// Basic Cloudflare IPv4 CIDR check
const CLOUDFLARE_IPS = [
  "173.245.48.0/20", "103.21.244.0/22", "103.22.200.0/22", "103.31.4.0/22",
  "141.101.64.0/18", "108.162.192.0/18", "190.93.240.0/20", "188.114.96.0/20",
  "197.234.240.0/22", "198.41.128.0/17", "162.158.0.0/15", "104.16.0.0/13",
  "104.24.0.0/14", "172.64.0.0/13", "131.0.72.0/22"
];

function ipInCidr(ip: string, cidr: string): boolean {
  try {
    const [range, bits] = cidr.split("/");
    const mask = ~(2 ** (32 - parseInt(bits, 10)) - 1);

    const ipParts = ip.split(".").map(Number);
    const rangeParts = range.split(".").map(Number);

    if (ipParts.length !== 4 || rangeParts.length !== 4) return false;

    const ipNum = (ipParts[0] << 24) | (ipParts[1] << 16) | (ipParts[2] << 8) | ipParts[3];
    const rangeNum = (rangeParts[0] << 24) | (rangeParts[1] << 16) | (rangeParts[2] << 8) | rangeParts[3];

    return (ipNum & mask) === (rangeNum & mask);
  } catch {
    return false;
  }
}

export const cloudflareOriginProtection = createMiddleware(async (c, next) => {
  // If we are in local dev, bypass
  if (process.env.NODE_ENV === "development") return next();

  // 1. Check custom secret header
  const secretHeader = c.req.header("X-Mercia-CF-Secret");
  if (!secretHeader || secretHeader !== process.env.CLOUDFLARE_SECRET) {
    await logSecurityEvent({
      eventType: "origin_bypass",
      severity: "CRITICAL",
      ipAddress: c.req.header("x-forwarded-for") || "unknown",
      userAgent: c.req.header("user-agent"),
      metadata: { reason: "Missing or invalid X-Mercia-CF-Secret" },
    });
    return c.text("Forbidden", 403);
  }

  // 2. We trust the proxy, so we could check the connecting IP here if the environment exposes the true socket remote IP.
  // Often Node behind a reverse proxy obscures this unless configured. We log and proceed based on the strong secret.

  return next();
});

export const securityHeaders = honoSecureHeaders({
  xFrameOptions: "DENY",
  xContentTypeOptions: "nosniff",
  referrerPolicy: "strict-origin-when-cross-origin",
  strictTransportSecurity: "max-age=31536000; includeSubDomains",
  contentSecurityPolicy: {
    defaultSrc: ["'self'"],
    imgSrc: ["'self'", "data:", "https:"],
    scriptSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"], // Allowed for basic React styling compat
    connectSrc: ["'self'", "https://*.googleapis.com", "https://*.microsoft.com"],
  },
});
