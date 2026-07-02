// DB-backed admin authentication. This is the Node-only glue that ties the pure
// pieces (rate-limit policy, credential check, session tokens) to Postgres via
// Prisma. It must only be imported from server code — never from the Edge
// middleware, which stays limited to signature/expiry checks.

import { getDb } from "@/lib/db";

import { LOGIN_RATE_LIMIT, SESSION_MAX_AGE_SECONDS } from "./constants";
import { normalizeEmail, verifyPassword } from "./credentials";
import { evaluateRateLimit } from "./rate-limit";
import {
  createSessionToken,
  getSessionSecret,
  verifySessionToken,
} from "./session";

export interface SignInInput {
  email: string;
  password: string;
  /** Coarse client identifier (e.g. hashed IP) for auditing; optional. */
  ipKey?: string;
}

export type SignInResult =
  | { ok: true; token: string; maxAgeSeconds: number }
  | { ok: false; reason: "rate_limited"; retryAfterMs: number }
  | { ok: false; reason: "invalid_credentials" };

/**
 * Attempt an admin sign-in. Enforces DB-backed per-email rate limiting, checks
 * credentials in constant time, records the attempt, and on success issues a
 * session token pinned to the admin's current `sessionVersion`.
 */
export async function signIn(input: SignInInput): Promise<SignInResult> {
  const db = getDb();
  const emailKey = normalizeEmail(input.email);
  const now = new Date();

  const recentAttempts = await db.loginAttempt.findMany({
    where: {
      emailKey,
      createdAt: { gte: new Date(now.getTime() - LOGIN_RATE_LIMIT.windowMs) },
    },
    select: { success: true, createdAt: true },
  });

  const decision = evaluateRateLimit(recentAttempts, now, LOGIN_RATE_LIMIT);
  if (decision.blocked) {
    return { ok: false, reason: "rate_limited", retryAfterMs: decision.retryAfterMs };
  }

  const admin = await db.admin.findFirst({
    where: { email: emailKey, isActive: true },
  });
  const passwordOk = await verifyPassword(
    input.password,
    admin?.passwordHash ?? null,
  );

  await db.loginAttempt.create({
    data: {
      emailKey,
      ipKey: input.ipKey ?? null,
      success: passwordOk,
      reason: passwordOk ? null : admin ? "bad_password" : "unknown_email",
    },
  });

  if (!admin || !passwordOk) {
    return { ok: false, reason: "invalid_credentials" };
  }

  const token = await createSessionToken(
    admin.id,
    admin.sessionVersion,
    getSessionSecret(),
  );
  return { ok: true, token, maxAgeSeconds: SESSION_MAX_AGE_SECONDS };
}

export interface AuthenticatedAdmin {
  id: string;
  email: string;
  name: string;
  role: string;
}

/**
 * Resolve the admin for a session token, enforcing revocation: the token's
 * `sessionVersion` must still match the stored one and the account must be
 * active. Returns null otherwise. Server-only (touches the database).
 */
export async function getAuthenticatedAdmin(
  token: string | undefined,
): Promise<AuthenticatedAdmin | null> {
  if (!token) {
    return null;
  }
  const claims = await verifySessionToken(token, getSessionSecret());
  if (!claims) {
    return null;
  }

  const admin = await getDb().admin.findFirst({
    where: { id: claims.subject, isActive: true },
  });
  if (!admin || admin.sessionVersion !== claims.sessionVersion) {
    return null;
  }

  return { id: admin.id, email: admin.email, name: admin.name, role: admin.role };
}
