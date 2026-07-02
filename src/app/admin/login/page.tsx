import type { Metadata } from "next";

import styles from "../admin.module.css";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Admin sign in · Tauras",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage(): React.JSX.Element {
  return (
    <main className={styles.screen}>
      <section className={styles.card}>
        <p className={styles.kicker}>Tauras · Carta</p>
        <h1 className={styles.title}>Admin sign in</h1>
        <LoginForm />
      </section>
    </main>
  );
}
