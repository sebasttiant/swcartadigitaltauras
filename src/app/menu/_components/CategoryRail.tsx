import { localize } from "@/lib/menu/format";
import type { Language, MenuCategory } from "@/lib/menu/types";

import styles from "./menu.module.css";

export interface CategoryRailProps {
  categories: MenuCategory[];
  lang: Language;
}

/** Wrapping chip nav that jumps to each category section (no horizontal scroll). */
export function CategoryRail({ categories, lang }: CategoryRailProps) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <nav
      className={styles.catNav}
      aria-label={lang === "es" ? "Categorías" : "Categories"}
    >
      {categories.map((category) => (
        <a
          key={category.id}
          className={styles.chip}
          href={`#category-${category.id}`}
        >
          {localize(category.name, lang)}
        </a>
      ))}
    </nav>
  );
}
