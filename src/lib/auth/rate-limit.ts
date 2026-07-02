// Pure rate-limit policy for admin sign-in. It takes the recent LoginAttempt
// records and decides whether the next attempt should be blocked. Keeping this
// free of I/O makes the throttling behavior deterministically testable; the DB
// query that supplies `attempts` lives in the auth service.

/** Minimal shape of a login attempt the policy needs. */
export interface LoginAttemptRecord {
  success: boolean;
  createdAt: Date;
}

export interface RateLimitConfig {
  /** How far back failures are counted, in milliseconds. */
  windowMs: number;
  /** Number of in-window failures that triggers a block. */
  maxFailures: number;
}

export interface RateLimitDecision {
  blocked: boolean;
  /** Milliseconds until the caller may retry (0 when not blocked). */
  retryAfterMs: number;
}

/**
 * Decide whether sign-in should be blocked given recent attempts. Only failures
 * inside the window count; a block clears as the oldest in-window failure ages
 * out, which is what `retryAfterMs` reports.
 */
export function evaluateRateLimit(
  attempts: readonly LoginAttemptRecord[],
  now: Date,
  config: RateLimitConfig,
): RateLimitDecision {
  const windowStart = now.getTime() - config.windowMs;

  const failures = attempts
    .filter(
      (attempt) => !attempt.success && attempt.createdAt.getTime() >= windowStart,
    )
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

  const oldest = failures[0];
  if (failures.length < config.maxFailures || !oldest) {
    return { blocked: false, retryAfterMs: 0 };
  }

  const retryAfterMs = oldest.createdAt.getTime() + config.windowMs - now.getTime();

  return { blocked: true, retryAfterMs: Math.max(0, retryAfterMs) };
}
