import { localize } from "@/lib/menu/format";
import type { Language, MenuLocation } from "@/lib/menu/types";

import styles from "./menu.module.css";

export interface LocationTabsProps {
  locations: MenuLocation[];
  activeId: string;
  lang: Language;
}

export function LocationTabs({ locations, activeId, lang }: LocationTabsProps) {
  return (
    <nav
      className={styles.tabsNav}
      aria-label={lang === "es" ? "Sedes" : "Locations"}
    >
      <ul className={styles.tabsList}>
        {locations.map((location) => {
          const active = location.id === activeId;
          return (
            <li key={location.id}>
              <a
                className={`${styles.tab} ${active ? styles.tabActive : ""}`}
                href={`?venue=${location.id}&lang=${lang}`}
                aria-current={active ? "page" : undefined}
              >
                {localize(location.name, lang)}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
