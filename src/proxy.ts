import { NextResponse, type NextRequest } from "next/server";

import { ADMIN_LOGIN_PATH, SESSION_COOKIE_NAME } from "@/lib/auth/constants";
import { getSessionSecret, verifySessionToken } from "@/lib/auth/session";

// Edge proxy (formerly "middleware") guarding the admin area. It only verifies
// the session token's signature and expiry (all that is available at the edge).
// Revocation via sessionVersion is enforced in the server components/actions
// that touch the DB.
export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  // The login page must stay reachable without a session.
  if (pathname === ADMIN_LOGIN_PATH) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const claims = token
    ? await verifySessionToken(token, getSessionSecret())
    : null;

  if (!claims) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = ADMIN_LOGIN_PATH;
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
