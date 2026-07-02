// DB-backed admin authentication. This is the Node-only glue that ties the pure
// pieces (rate-limit policy, credential check, session tokens) to Postgres via
// Prisma. It must only be imported from server code — never from the Edge
// middleware, which stays limited to signature/expiry checks.

import { Prisma, type PrismaClient } from "@prisma/client";

import { getDb } from "@/lib/db";

import {
  LOGIN_RATE_LIMIT,
  LOGIN_RATE_LIMIT_IP,
  SESSION_MAX_AGE_SECONDS,
} from "./constants";
import { normalizeEmail, verifyPassword } from "./credentials";
import { evaluateLoginThrottle } from "./rate-limit";
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

const RESERVE_MAX_RETRIES = 4;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * True for Postgres serialization/deadlock failures that are worth retrying.
 * These surface in two shapes with the pg driver adapter: a commit-time
 * `PrismaClientKnownRequestError` (code `P2034`), and a statement-time
 * `DriverAdapterError: TransactionWriteConflict`. Match both, plus the raw
 * SQLSTATE codes, defensively across name/message/cause.
 */
function isSerializationError(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }
  const err = error as {
    code?: string;
    name?: string;
    message?: string;
    cause?: { name?: string; message?: string };
  };
  if (err.code === "P2034" || err.code === "40001" || err.code === "40P01") {
    return true;
  }
  const haystack = [
    err.name,
    err.message,
    err.cause?.name,
    err.cause?.message,
  ]
    .filter(Boolean)
    .join(" ");
  return /write ?conflict|could not serialize|serialization failure|deadlock/i.test(
    haystack,
  );
}

type Reservation =
  | { blocked: true; retryAfterMs: number }
  | { blocked: false; attemptId: string };

/**
 * Atomically decide whether this sign-in may proceed and, if so, reserve a
 * pending attempt row — both inside one Serializable transaction. Because the
 * count and the reserving insert are serialized, a concurrent burst cannot slip
 * past the ceiling via a read-then-insert race. Serialization conflicts are
 * retried with backoff a bounded number of times; if they persist we fail
 * closed (block) rather than silently allow. bcrypt is intentionally kept
 * OUTSIDE the transaction so locks are not held across the hash.
 */
async function reserveLoginSlot(
  db: PrismaClient,
  emailKey: string,
  ipKey: string | null,
  now: Date,
): Promise<Reservation> {
  const windowMs = Math.max(LOGIN_RATE_LIMIT.windowMs, LOGIN_RATE_LIMIT_IP.windowMs);
  const since = new Date(now.getTime() - windowMs);

  for (let attempt = 0; attempt < RESERVE_MAX_RETRIES; attempt++) {
    try {
      return await db.$transaction(
        async (tx): Promise<Reservation> => {
          const recent = await tx.loginAttempt.findMany({
            where: {
              createdAt: { gte: since },
              OR: [{ emailKey }, ...(ipKey ? [{ ipKey }] : [])],
            },
            select: { emailKey: true, ipKey: true, success: true, createdAt: true },
          });
          const emailAttempts = recent.filter((a) => a.emailKey === emailKey);
          const ipAttempts = ipKey
            ? recent.filter((a) => a.ipKey === ipKey)
            : [];

          const decision = evaluateLoginThrottle(emailAttempts, ipAttempts, now, {
            email: LOGIN_RATE_LIMIT,
            ip: LOGIN_RATE_LIMIT_IP,
          });
          if (decision.blocked) {
            return { blocked: true, retryAfterMs: decision.retryAfterMs };
          }

          // Reserve a pending failure slot so concurrent transactions count this
          // in-flight attempt; it is finalized after bcrypt below.
          const row = await tx.loginAttempt.create({
            data: { emailKey, ipKey, success: false, reason: "pending" },
            select: { id: true },
          });
          return { blocked: false, attemptId: row.id };
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      );
    } catch (error) {
      if (isSerializationError(error) && attempt < RESERVE_MAX_RETRIES - 1) {
        await sleep(15 * 2 ** attempt + Math.floor(Math.random() * 15));
        continue;
      }
      if (isSerializationError(error)) {
        return { blocked: true, retryAfterMs: LOGIN_RATE_LIMIT.windowMs };
      }
      throw error;
    }
  }
  return { blocked: true, retryAfterMs: LOGIN_RATE_LIMIT.windowMs };
}

/**
 * Attempt an admin sign-in. Enforces DB-backed per-email and per-IP rate
 * limiting atomically, checks credentials in constant time, and on success
 * issues a session token pinned to the admin's current `sessionVersion`.
 */
export async function signIn(input: SignInInput): Promise<SignInResult> {
  const db = getDb();
  const emailKey = normalizeEmail(input.email);
  const ipKey = input.ipKey ?? null;
  const now = new Date();

  // Blocked path returns before any admin lookup or bcrypt work, so a throttled
  // source cannot drive CPU cost, and no row is inserted so the window ages out
  // for a legitimate user who simply retried too fast.
  const reservation = await reserveLoginSlot(db, emailKey, ipKey, now);
  if (reservation.blocked) {
    return {
      ok: false,
      reason: "rate_limited",
      retryAfterMs: reservation.retryAfterMs,
    };
  }

  const admin = await db.admin.findFirst({
    where: { email: emailKey, isActive: true },
  });
  const passwordOk = await verifyPassword(
    input.password,
    admin?.passwordHash ?? null,
  );

  // Finalize the reserved slot with the real outcome.
  await db.loginAttempt.update({
    where: { id: reservation.attemptId },
    data: {
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
