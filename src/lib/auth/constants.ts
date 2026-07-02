// Shared between the Node server glue and the Edge middleware, so this module
// must stay free of `server-only` and Node-only imports.
export const SESSION_COOKIE_NAME = "tauras_admin_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8; // 8 hours

// Sign-in throttling. Counts failed attempts per email within the window.
export const LOGIN_RATE_LIMIT = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxFailures: 5,
} as const;

/** Where the admin panel lives; used by middleware and redirects. */
export const ADMIN_LOGIN_PATH = "/admin/login";
export const ADMIN_HOME_PATH = "/admin";
