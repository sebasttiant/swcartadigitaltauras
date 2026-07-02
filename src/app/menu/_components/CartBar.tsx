"use client";

import { publicMenuDictionary } from "@/lib/i18n/public-menu-dictionary";
import { cartCount, cartTotal, lineKey } from "@/lib/menu/cart";
import { formatPrice, localize } from "@/lib/menu/format";
import { buildWhatsAppMenuUrl } from "@/lib/menu/whatsapp";

import { useCart } from "./CartProvider";
import styles from "./menu.module.css";

/** Sticky order summary with per-line quantity controls and a WhatsApp hand-off. */
export function CartBar() {
  const { state, dispatch, location, lang } = useCart();
  const copy = publicMenuDictionary[lang];
  const count = cartCount(state);

  if (count === 0) {
    return null;
  }

  const total = cartTotal(state);
  const whatsAppUrl = buildWhatsAppMenuUrl({
    location,
    lines: state.lines,
    lang,
  });

  return (
    <section className={styles.cartBar} aria-label={copy.cartTitle}>
      <ul className={styles.cartLines}>
        {state.lines.map((line) => {
          const key = lineKey(line);
          const name = localize(line.item.name, lang);
          const variant = line.variant
            ? ` · ${localize(line.variant.label, lang)}`
            : "";
          return (
            <li key={key} className={styles.cartLine}>
              <span className={styles.cartLineName}>
                {name}
                {variant}
              </span>
              <div className={styles.qty}>
                <button
                  type="button"
                  className={styles.qtyButton}
                  aria-label={`${lang === "es" ? "Quitar uno" : "Remove one"} ${name}`}
                  onClick={() => dispatch({ type: "decrement", key })}
                >
                  −
                </button>
                <span className={styles.qtyValue}>{line.quantity}</span>
                <button
                  type="button"
                  className={styles.qtyButton}
                  aria-label={`${lang === "es" ? "Agregar uno" : "Add one"} ${name}`}
                  onClick={() => dispatch({ type: "increment", key })}
                >
                  +
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <div className={styles.cartFooter}>
        <div className={styles.cartTotalRow}>
          <span>{copy.totalLabel}</span>
          <span className={styles.cartTotal}>{formatPrice(total)}</span>
        </div>
        <a
          className={styles.whatsappCta}
          href={whatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {copy.sendWhatsApp}
        </a>
      </div>
    </section>
  );
}
