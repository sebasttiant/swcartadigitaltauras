import { describe, expect, it } from "vitest";

import { deriveClientKey, hashClientKey, parseClientIp } from "./ip";

const secret = "test-secret-value-at-least-32-chars-long";

describe("parseClientIp", () => {
  it("takes the first hop of x-forwarded-for", () => {
    expect(parseClientIp("203.0.113.7, 10.0.0.1, 10.0.0.2", null)).toBe(
      "203.0.113.7",
    );
  });

  it("trims surrounding whitespace", () => {
    expect(parseClientIp("  203.0.113.7  ", null)).toBe("203.0.113.7");
  });

  it("falls back to x-real-ip when there is no forwarded-for", () => {
    expect(parseClientIp(null, "198.51.100.9")).toBe("198.51.100.9");
  });

  it("returns null when no header is present", () => {
    expect(parseClientIp(null, null)).toBeNull();
  });

  it("returns null for empty header values", () => {
    expect(parseClientIp("", "  ")).toBeNull();
  });
});

describe("hashClientKey", () => {
  it("is deterministic for the same ip and secret", () => {
    expect(hashClientKey("203.0.113.7", secret)).toBe(
      hashClientKey("203.0.113.7", secret),
    );
  });

  it("differs for different ips", () => {
    expect(hashClientKey("203.0.113.7", secret)).not.toBe(
      hashClientKey("203.0.113.8", secret),
    );
  });

  it("differs for different secrets", () => {
    expect(hashClientKey("203.0.113.7", secret)).not.toBe(
      hashClientKey("203.0.113.7", "another-secret-value-also-32-chars-xx"),
    );
  });

  it("never leaks the raw ip in the derived key", () => {
    const key = hashClientKey("203.0.113.7", secret);
    expect(key).not.toContain("203.0.113.7");
  });
});

describe("deriveClientKey", () => {
  it("returns a non-null hashed key when an ip is present", () => {
    const key = deriveClientKey("203.0.113.7", null, secret);
    expect(key).not.toBeNull();
    expect(key).not.toBe("203.0.113.7");
  });

  it("returns null (safe anonymous behavior) when no trusted ip is available", () => {
    expect(deriveClientKey(null, null, secret)).toBeNull();
  });
});
