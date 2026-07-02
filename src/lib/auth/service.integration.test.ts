import { hash } from "bcryptjs";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { getDb } from "@/lib/db";

import { getAuthenticatedAdmin, signIn } from "./service";

// DB-backed auth needs a live Postgres, which the CI `verify` job does not have.
// These tests therefore run only when DATABASE_URL is set (locally, or once a
// Postgres service is wired into CI) and are skipped otherwise. getDb() is only
// called inside hooks/tests so a skipped suite never tries to connect.
const hasDatabase = Boolean(process.env.DATABASE_URL);

describe.skipIf(!hasDatabase)("DB-backed admin auth (integration)", () => {
  type Db = ReturnType<typeof getDb>;
  let db: Db;

  const email = "auth-integration@example.test";
  const password = "IntegrationPass123!";
  let adminId: string;

  beforeAll(async () => {
    // signIn/getAuthenticatedAdmin sign tokens, so a secret must be present.
    if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) {
      process.env.SESSION_SECRET = "integration-test-session-secret-32chars!!";
    }
    db = getDb();
    await db.loginAttempt.deleteMany({ where: { emailKey: email } });
    await db.admin.deleteMany({ where: { email } });
    const admin = await db.admin.create({
      data: {
        email,
        passwordHash: await hash(password, 12),
        name: "Integration Admin",
        role: "MENU_EDITOR",
      },
    });
    adminId = admin.id;
  });

  afterAll(async () => {
    if (!db) return;
    await db.loginAttempt.deleteMany({ where: { emailKey: email } });
    await db.admin.deleteMany({ where: { email } });
  });

  it("returns a token for correct credentials", async () => {
    const result = await signIn({ email, password });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.token.length).toBeGreaterThan(0);
    }
  });

  it("rejects an inactive admin", async () => {
    await db.admin.update({ where: { id: adminId }, data: { isActive: false } });
    try {
      const result = await signIn({ email, password });
      expect(result.ok).toBe(false);
    } finally {
      await db.admin.update({ where: { id: adminId }, data: { isActive: true } });
    }
  });

  it("invalidates a session when sessionVersion is bumped", async () => {
    const result = await signIn({ email, password });
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    // The freshly issued token resolves the admin...
    expect(await getAuthenticatedAdmin(result.token)).not.toBeNull();

    // ...but bumping sessionVersion (revocation) invalidates it.
    await db.admin.update({
      where: { id: adminId },
      data: { sessionVersion: { increment: 1 } },
    });
    expect(await getAuthenticatedAdmin(result.token)).toBeNull();
  });

  it("throttles by IP across different emails, independent of the email limit", async () => {
    const ipKey = "integration-flood-ip-key";
    // Simulate a burst of failures from one IP against many different emails —
    // none of them the real admin, so the email dimension stays clear.
    await db.loginAttempt.createMany({
      data: Array.from({ length: 20 }, (_, i) => ({
        emailKey: `flood-${i}@example.test`,
        ipKey,
        success: false,
        reason: "bad_password",
      })),
    });

    try {
      // Even with correct credentials, this source IP is blocked.
      const result = await signIn({ email, password, ipKey });
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.reason).toBe("rate_limited");
      }

      // A request without that IP still authenticates (limit is per-IP).
      const clean = await signIn({ email, password });
      expect(clean.ok).toBe(true);
    } finally {
      await db.loginAttempt.deleteMany({ where: { ipKey } });
    }
  });
});
