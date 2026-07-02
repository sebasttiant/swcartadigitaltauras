// Shared between the Node server glue and the Edge middleware, so this module
// must stay free of `server-only` and Node-only imports.
export const SESSION_COOKIE_NAME = "tauras_admin_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8; // 8 hours
