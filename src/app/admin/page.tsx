import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ADMIN_LOGIN_PATH, SESSION_COOKIE_NAME } from "@/lib/auth/constants";
import { getAuthenticatedAdmin } from "@/lib/auth/service";

import styles from "./admin.module.css";
import { logoutAction } from "./login/actions";

export const metadata: Metadata = {
  title: "Admin · Tauras",
  robots: { index: false, follow: false },
};

// Reads the session cookie, so this route is always dynamically rendered and is
// never evaluated (nor is the DB touched) during the build.
export const dynamic = "force-dynamic";

export default async function AdminHomePage(): Promise<React.JSX.Element> {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  const admin = await getAuthenticatedAdmin(token);

  // Defense in depth: the middleware already gates on token validity, but only
  // here can we enforce sessionVersion revocation and account status via the DB.
  if (!admin) {
    redirect(ADMIN_LOGIN_PATH);
  }

  return (
    <main className={styles.dashboard}>
      <header className={styles.dashboardHeader}>
        <div>
          <p className={styles.kicker}>Tauras · Carta</p>
          <h1 className={styles.title}>Menu admin</h1>
          <p className={styles.muted}>
            Signed in as {admin.name} ({admin.email})
          </p>
        </div>
        <form action={logoutAction}>
          <button type="submit" className={styles.linkButton}>
            Sign out
          </button>
        </form>
      </header>

      <p className={styles.muted}>
        Menu management (brands, categories, dishes, promotions and photos)
        arrives in the next slice.
      </p>
    </main>
  );
}
