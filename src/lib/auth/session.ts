import { SignJWT, jwtVerify } from "jose";

import { SESSION_MAX_AGE_SECONDS } from "./constants";

/** Verified session claims: which admin, and at which session version. */
export interface SessionClaims {
  subject: string;
  sessionVersion: number;
}

/** Encode a raw secret string into the byte form jose expects. */
export function encodeSecret(secret: string): Uint8Array {
  return new TextEncoder().encode(secret);
}

/**
 * Read and validate the signing secret from the environment. Edge-safe so the
 * middleware can call it; throws when misconfigured so a weak secret can never
 * silently ship.
 */
export function getSessionSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "SESSION_SECRET is missing or shorter than 32 characters.",
    );
  }
  return encodeSecret(secret);
}

/**
 * Sign a short-lived admin session token (HS256). The `sv` claim pins the
 * admin's `sessionVersion` so bumping it server-side revokes older sessions.
 * Edge-safe (jose only), so the middleware can verify without Node APIs.
 */
export async function createSessionToken(
  subject: string,
  sessionVersion: number,
  secret: Uint8Array,
): Promise<string> {
  return new SignJWT({ sv: sessionVersion })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(subject)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(secret);
}

/**
 * Verify a session token, returning its claims or null when the token is
 * invalid, expired, or missing the subject/sessionVersion claims. Callers must
 * still compare `sessionVersion` against the current admin row to honor
 * revocation.
 */
export async function verifySessionToken(
  token: string,
  secret: Uint8Array,
): Promise<SessionClaims | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    const subject = payload.sub;
    const sessionVersion = payload.sv;

    if (typeof subject !== "string" || subject.length === 0) {
      return null;
    }
    if (typeof sessionVersion !== "number" || !Number.isInteger(sessionVersion)) {
      return null;
    }

    return { subject, sessionVersion };
  } catch {
    return null;
  }
}
