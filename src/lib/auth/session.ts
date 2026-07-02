import { SignJWT, jwtVerify } from "jose";

/** Encode a raw secret string into the byte form jose expects. */
export function encodeSecret(secret: string): Uint8Array {
  return new TextEncoder().encode(secret);
}

/** Sign a short-lived admin session token (HS256, 8h). Edge-safe (jose only). */
export async function createSessionToken(
  subject: string,
  secret: Uint8Array,
): Promise<string> {
  return new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(subject)
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(secret);
}

/** Verify a session token, returning its subject or null when invalid/expired. */
export async function verifySessionToken(
  token: string,
  secret: Uint8Array,
): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return typeof payload.sub === "string" && payload.sub.length > 0
      ? payload.sub
      : null;
  } catch {
    return null;
  }
}
