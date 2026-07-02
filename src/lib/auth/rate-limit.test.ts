import { describe, expect, it } from "vitest";

import { evaluateRateLimit, type LoginAttemptRecord } from "./rate-limit";

const config = { windowMs: 15 * 60 * 1000, maxFailures: 5 };
const now = new Date("2026-07-02T12:00:00.000Z");

function failuresAt(...offsetsMs: number[]): LoginAttemptRecord[] {
  return offsetsMs.map((offset) => ({
    success: false,
    createdAt: new Date(now.getTime() - offset),
  }));
}

describe("evaluateRateLimit", () => {
  it("allows when there are no prior attempts", () => {
    expect(evaluateRateLimit([], now, config)).toEqual({
      blocked: false,
      retryAfterMs: 0,
    });
  });

  it("allows while failures stay below the threshold", () => {
    const attempts = failuresAt(1000, 2000, 3000, 4000);
    expect(evaluateRateLimit(attempts, now, config).blocked).toBe(false);
  });

  it("blocks once failures reach the threshold within the window", () => {
    const attempts = failuresAt(1000, 2000, 3000, 4000, 5000);
    const result = evaluateRateLimit(attempts, now, config);

    expect(result.blocked).toBe(true);
    expect(result.retryAfterMs).toBeGreaterThan(0);
  });

  it("ignores failures that fall outside the window", () => {
    const oldest = config.windowMs + 1000;
    const attempts = failuresAt(oldest, oldest, oldest, oldest, oldest);

    expect(evaluateRateLimit(attempts, now, config).blocked).toBe(false);
  });

  it("does not count successful attempts toward the limit", () => {
    const attempts: LoginAttemptRecord[] = [
      ...failuresAt(1000, 2000, 3000, 4000),
      { success: true, createdAt: new Date(now.getTime() - 500) },
    ];

    expect(evaluateRateLimit(attempts, now, config).blocked).toBe(false);
  });

  it("reports retryAfter as the time for the oldest in-window failure to age out", () => {
    const attempts = failuresAt(1000, 2000, 3000, 4000, 5000);
    const result = evaluateRateLimit(attempts, now, config);

    // Oldest failure is 5000ms old; it ages out at windowMs, so retry ~= window - 5000.
    expect(result.retryAfterMs).toBe(config.windowMs - 5000);
  });
});
