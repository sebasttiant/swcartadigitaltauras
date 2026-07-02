"use client";

import { useContext } from "react";

import { publicMenuDictionary } from "@/lib/i18n/public-menu-dictionary";
import { formatPrice, localize } from "@/lib/menu/format";
import type { MenuItem } from "@/lib/menu/types";

import { CartContext } from "./CartProvider";
import styles from "./menu.module.css";

export interface AddToCartControlsProps {
  item: MenuItem;
}

/**
 * Add affordance for an item. Renders nothing outside a cart context or for
 * unavailable items, so it can be safely embedded in the presentational card.
 */
export function AddToCartControls({ item }: AddToCartControlsProps) {
  const cart = useContext(CartContext);
  if (!cart || !item.available) {
    return null;
  }

  const { dispatch, location, lang } = cart;
  const copy = publicMenuDictionary[lang];
  const name = localize(item.name, lang);

  if (item.variants && item.variants.length > 0) {
    return (
      <div className={styles.addRow}>
        {item.variants.map((variant) => (
          <button
            key={variant.id}
            type="button"
            className={styles.addButton}
            aria-label={`${copy.addToCart} ${name} ${localize(variant.label, lang)}`}
            onClick={() =>
              dispatch({ type: "add", locationId: location.id, item, variant })
            }
          >
            {localize(variant.label, lang)} · {formatPrice(variant.price)}
          </button>
        ))}
      </div>
    );
  }

  return (
    <button
      type="button"
      className={styles.addButton}
      aria-label={`${copy.addToCart} ${name}`}
      onClick={() => dispatch({ type: "add", locationId: location.id, item })}
    >
      {copy.addToCart}
    </button>
  );
}
