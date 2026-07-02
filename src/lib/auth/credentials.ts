import { compare, hash } from "bcryptjs";

// A valid bcrypt hash to compare against when the email does not match, so the
// wrong-email path costs the same time as the wrong-password path and cannot be
// used as a timing side-channel. Computed once per process at the real cost.
const dummyHashPromise: Promise<string> = hash(
  "not-a-real-password-just-padding",
  12,
);

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

/**
 * Compare a password against a stored bcrypt hash. When no hash is given (e.g.
 * the email did not match any admin) it still runs a bcrypt comparison against
 * a dummy hash so the timing does not reveal whether the account exists.
 */
export async function verifyPassword(
  password: string,
  passwordHash: string | null,
): Promise<boolean> {
  if (passwordHash === null) {
    await compare(password, await dummyHashPromise);
    return false;
  }
  return compare(password, passwordHash);
}
