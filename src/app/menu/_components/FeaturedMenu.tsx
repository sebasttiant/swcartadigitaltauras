import { publicMenuDictionary } from "@/lib/i18n/public-menu-dictionary";
import { getFeaturedItems } from "@/lib/menu/format";
import { MENU_FEATURE_KINDS } from "@/lib/menu/types";
import type { Language, MenuLocation } from "@/lib/menu/types";

import { MenuItemCard } from "./MenuItemCard";
import styles from "./menu.module.css";

export interface FeaturedMenuProps {
  location: MenuLocation;
  lang: Language;
}

export function FeaturedMenu({ location, lang }: FeaturedMenuProps) {
  const copy = publicMenuDictionary[lang];
  const sections = MENU_FEATURE_KINDS.map((kind) => ({
    kind,
    items: getFeaturedItems(location, kind),
  })).filter((section) => section.items.length > 0);

  if (sections.length === 0) {
    return null;
  }

  return (
    <section
      className={styles.featured}
      aria-label={lang === "es" ? "Destacados" : "Featured"}
    >
      {sections.map(({ kind, items }) => (
        <div key={kind} className={styles.featuredSection}>
          <h2 className={styles.featuredHeading}>{copy.featuredTitle[kind]}</h2>
          <div className={styles.rail}>
            {items.map((item) => (
              <MenuItemCard key={item.id} item={item} lang={lang} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
