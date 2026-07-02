import { publicMenuDictionary } from "@/lib/i18n/public-menu-dictionary";
import { localize, sortMenuItems, isMenuEmpty } from "@/lib/menu/format";
import type { Language, MenuLocation } from "@/lib/menu/types";

import { CartBar } from "./CartBar";
import { CartProvider } from "./CartProvider";
import { CategoryRail } from "./CategoryRail";
import { FeaturedMenu } from "./FeaturedMenu";
import { LanguageSwitch } from "./LanguageSwitch";
import { LocationTabs } from "./LocationTabs";
import { MenuHero } from "./MenuHero";
import { MenuItemCard } from "./MenuItemCard";
import styles from "./menu.module.css";

export interface MenuScreenProps {
  location: MenuLocation;
  locations: MenuLocation[];
  lang: Language;
}

/**
 * Composition root for the public menu. Server component that resolves data and
 * renders the mobile-first screen; the cart island adds client interactivity.
 */
export function MenuScreen({ location, locations, lang }: MenuScreenProps) {
  const copy = publicMenuDictionary[lang];
  const empty = isMenuEmpty(location);

  return (
    <CartProvider location={location} lang={lang}>
      <div className={styles.screen}>
        <div className={styles.topbar}>
          <LanguageSwitch lang={lang} venue={location.id} />
        </div>

        <MenuHero
          locationName={localize(location.name, lang)}
          tagline={copy.heroTagline}
        />

        <LocationTabs locations={locations} activeId={location.id} lang={lang} />

        {empty ? (
          <p className={styles.emptyMenu}>{copy.emptyMenu}</p>
        ) : (
          <>
            <FeaturedMenu location={location} lang={lang} />
            <CategoryRail categories={location.categories} lang={lang} />
            <main className={styles.menu}>
              {location.categories.map((category) => (
                <section
                  key={category.id}
                  id={`category-${category.id}`}
                  className={styles.category}
                >
                  <h2 className={styles.categoryHeading}>
                    {localize(category.name, lang)}
                  </h2>
                  <div className={styles.grid}>
                    {sortMenuItems(category.items).map((item) => (
                      <MenuItemCard key={item.id} item={item} lang={lang} />
                    ))}
                  </div>
                </section>
              ))}
            </main>
          </>
        )}

        <CartBar />
      </div>
    </CartProvider>
  );
}
