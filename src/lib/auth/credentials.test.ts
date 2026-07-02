import { hash } from "bcryptjs";
import { beforeAll, describe, expect, it } from "vitest";

import { normalizeEmail, verifyPassword } from "./credentials";

const PASSWORD = "correct horse battery staple";
let passwordHash: string;

beforeAll(async () => {
  passwordHash = await hash(PASSWORD, 12);
});

describe("verifyPassword", () => {
  it("accepts the correct password for a stored hash", async () => {
    expect(await verifyPassword(PASSWORD, passwordHash)).toBe(true);
  });

  it("rejects a wrong password", async () => {
    expect(await verifyPassword("wrong", passwordHash)).toBe(false);
  });

  it("rejects (without throwing) when there is no stored hash", async () => {
    // Mirrors the unknown/deactivated-admin path: a dummy comparison still runs
    // so timing cannot reveal whether the account exists.
    expect(await verifyPassword(PASSWORD, null)).toBe(false);
  });
});

describe("normalizeEmail", () => {
  it("trims surrounding whitespace and lowercases", () => {
    expect(normalizeEmail("  ADMIN@ilasesorias  ")).toBe("admin@ilasesorias");
  });
});
