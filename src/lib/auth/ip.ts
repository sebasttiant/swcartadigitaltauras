import { createHash } from "node:crypto";

// Derives a coarse, privacy-preserving client key for rate limiting. The raw IP
// is never stored: it is hashed with the session secret so LoginAttempt.ipKey
// is a stable opaque token, not personal data. When no trusted IP is available
// the key is null and the caller falls back to email-only throttling (safe: it
// never blocks legitimate users, it just declines the extra IP dimension).

/** Pick the client IP from proxy headers, preferring the first forwarded hop. */
export function parseClientIp(
  forwardedFor: string | null,
  realIp: string | null,
): string | null {
  const firstHop = forwardedFor?.split(",")[0]?.trim();
  if (firstHop) {
    return firstHop;
  }
  const real = realIp?.trim();
  return real && real.length > 0 ? real : null;
}

/** Hash an IP into a fixed-length opaque key; the raw IP cannot be recovered. */
export function hashClientKey(ip: string, secret: string): string {
  return createHash("sha256").update(`${secret}:${ip}`).digest("base64url").slice(0, 32);
}

/**
 * Resolve the hashed client key from request headers, or null when there is no
 * trusted IP to key on.
 */
export function deriveClientKey(
  forwardedFor: string | null,
  realIp: string | null,
  secret: string,
): string | null {
  const ip = parseClientIp(forwardedFor, realIp);
  return ip ? hashClientKey(ip, secret) : null;
}
