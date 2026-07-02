import { publicMenuDictionary } from "@/lib/i18n/public-menu-dictionary";
import { featureBadgeLabel, formatPrice, localize } from "@/lib/menu/format";
import type { Language, MenuItem } from "@/lib/menu/types";

import styles from "./menu.module.css";

function priceLabel(item: MenuItem, lang: Language): string {
  if (item.variants && item.variants.length > 0) {
    const lowest = Math.min(...item.variants.map((variant) => variant.price));
    const prefix = lang === "es" ? "desde " : "from ";
    return `${prefix}${formatPrice(lowest)}`;
  }
  return formatPrice(item.price);
}

export interface MenuItemCardProps {
  item: MenuItem;
  lang: Language;
}

export function MenuItemCard({ item, lang }: MenuItemCardProps) {
  const copy = publicMenuDictionary[lang];
  const name = localize(item.name, lang);
  const description = item.description ? localize(item.description, lang) : null;
  const price = priceLabel(item, lang);

  return (
    <article
      className={`${styles.card} ${item.available ? "" : styles.cardUnavailable}`}
      data-available={item.available}
    >
      <div className={styles.cardMedia} aria-hidden="true" />
      <div className={styles.cardBody}>
        {item.features && item.features.length > 0 ? (
          <div className={styles.badgeRow}>
            {item.features.map((kind) => (
              <span key={kind} className={styles.badge}>
                {featureBadgeLabel(kind, lang)}
              </span>
            ))}
          </div>
        ) : null}
        <h3 className={styles.itemName}>{name}</h3>
        {description ? <p className={styles.itemDesc}>{description}</p> : null}
        <div className={styles.itemFooter}>
          {item.available ? (
            price ? (
              <span className={styles.price}>{price}</span>
            ) : null
          ) : (
            <span className={styles.unavailableTag}>{copy.unavailable}</span>
          )}
        </div>
      </div>
    </article>
  );
}
