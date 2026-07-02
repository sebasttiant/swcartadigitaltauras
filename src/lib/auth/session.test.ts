import { SignJWT } from "jose";
import { describe, expect, it } from "vitest";

import {
  createSessionToken,
  encodeSecret,
  verifySessionToken,
} from "./session";

const secret = encodeSecret("test-secret-value-at-least-32-chars-long");

describe("session tokens", () => {
  it("round-trips subject and sessionVersion", async () => {
    const token = await createSessionToken("admin-123", 4, secret);
    const claims = await verifySessionToken(token, secret);

    expect(claims).toEqual({ subject: "admin-123", sessionVersion: 4 });
  });

  it("rejects a token signed with a different secret", async () => {
    const token = await createSessionToken("admin-123", 0, secret);
    const other = encodeSecret("another-secret-value-also-32-chars-xx");

    expect(await verifySessionToken(token, other)).toBeNull();
  });

  it("rejects a malformed token", async () => {
    expect(await verifySessionToken("not-a-jwt", secret)).toBeNull();
  });

  it("rejects an expired token", async () => {
    const expired = await new SignJWT({ sv: 0 })
      .setProtectedHeader({ alg: "HS256" })
      .setSubject("admin-123")
      .setIssuedAt(0)
      .setExpirationTime(1) // epoch second 1 — long in the past
      .sign(secret);

    expect(await verifySessionToken(expired, secret)).toBeNull();
  });

  it("rejects a token missing the sessionVersion claim", async () => {
    const noSv = await new SignJWT({})
      .setProtectedHeader({ alg: "HS256" })
      .setSubject("admin-123")
      .setIssuedAt()
      .setExpirationTime("8h")
      .sign(secret);

    expect(await verifySessionToken(noSv, secret)).toBeNull();
  });
});
