"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  ADMIN_HOME_PATH,
  ADMIN_LOGIN_PATH,
  SESSION_COOKIE_NAME,
} from "@/lib/auth/constants";
import { deriveClientKey } from "@/lib/auth/ip";
import { signIn } from "@/lib/auth/service";

export interface LoginState {
  error?: string;
}

/**
 * Server action backing the login form. On success it sets an httpOnly session
 * cookie and redirects to the admin home; on failure it returns a generic
 * message so the response never reveals whether the email exists.
 */
export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  // Derive a hashed, coarse client key for per-IP throttling. When no trusted
  // IP or secret is available we simply omit it and fall back to email-only.
  const headerList = await headers();
  const secret = process.env.SESSION_SECRET ?? "";
  const ipKey =
    secret.length >= 32
      ? (deriveClientKey(
          headerList.get("x-forwarded-for"),
          headerList.get("x-real-ip"),
          secret,
        ) ?? undefined)
      : undefined;

  const result = await signIn({ email, password, ipKey });

  if (!result.ok) {
    if (result.reason === "rate_limited") {
      return { error: "Too many attempts. Please wait a few minutes and try again." };
    }
    return { error: "Invalid email or password." };
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: result.maxAgeSeconds,
  });

  redirect(ADMIN_HOME_PATH);
}

/** Clear the session cookie and return to the login page. */
export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  redirect(ADMIN_LOGIN_PATH);
}
