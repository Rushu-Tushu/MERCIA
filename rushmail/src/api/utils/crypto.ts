import { randomBytes, createCipheriv, createDecipheriv } from "crypto";

function getKey() {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) throw new Error("ENCRYPTION_KEY is not set in environment variables");
  // Expect a 64-char hex string (32 bytes) or fallback if dev? We enforce it.
  if (key.length !== 64) throw new Error("ENCRYPTION_KEY must be a 64-character hex string (32 bytes)");
  return Buffer.from(key, "hex");
}

export function encryptToken(text: string): string {
  if (!text) return text;
  const iv = randomBytes(12); // 96-bit IV for GCM
  const cipher = createCipheriv("aes-256-gcm", getKey(), iv);
  
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  
  const authTag = cipher.getAuthTag().toString("hex");
  
  // Format: iv:encrypted:authTag
  return `${iv.toString("hex")}:${encrypted}:${authTag}`;
}

export function decryptToken(encryptedData: string): string {
  if (!encryptedData) return encryptedData;
  const parts = encryptedData.split(":");
  
  // If it doesn't match the iv:encrypted:authTag format, assume it's plain text (e.g. from Better Auth's default storage)
  if (parts.length !== 3) return encryptedData;
  
  const [ivHex, encryptedText, authTagHex] = parts;
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");
  
  const decipher = createDecipheriv("aes-256-gcm", getKey(), iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

/**
 * Generates a 21-character URL-safe random string.
 * Similar entropy to UUIDv4, but shorter and URL-safe.
 */
export function generatePublicId(): string {
  return randomBytes(16)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "")
    .substring(0, 21);
}
