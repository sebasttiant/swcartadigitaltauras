import { compare, hash } from "bcryptjs";

// A valid bcrypt hash to compare against when the email does not match, so the
// wrong-email path costs the same time as the wrong-password path and cannot be
// used as a timing side-channel. Computed once per process at the real cost.
const dummyHashPromise: Promise<string> = hash(
  "not-a-real-password-just-padding",
  12,
);

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export interface CredentialCheck {
  email: string;
  password: string;
  expectedEmail: string;
  passwordHash: string;
}

/**
 * Verify admin credentials against the single configured admin. Always runs a
 * bcrypt comparison (real or dummy) so the response time does not leak whether
 * the email matched.
 */
export async function verifyAdminCredentials(
  input: CredentialCheck,
): Promise<boolean> {
  const emailMatches =
    normalizeEmail(input.email) === normalizeEmail(input.expectedEmail);
  if (!emailMatches) {
    await compare(input.password, await dummyHashPromise);
    return false;
  }
  return compare(input.password, input.passwordHash);
}
