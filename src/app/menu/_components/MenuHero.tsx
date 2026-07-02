import styles from "./menu.module.css";

export interface MenuHeroProps {
  locationName: string;
  tagline: string;
}

export function MenuHero({ locationName, tagline }: MenuHeroProps) {
  return (
    <header className={styles.hero}>
      <p className={styles.brand}>Tauras</p>
      <h1 className={styles.heroTitle}>{locationName}</h1>
      <p className={styles.heroTagline}>{tagline}</p>
    </header>
  );
}
