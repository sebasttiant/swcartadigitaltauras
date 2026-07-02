import { publicMenuDictionary } from "@/lib/i18n/public-menu-dictionary";
import type {
  Language,
  LocalizedText,
  MenuFeatureKind,
  MenuItem,
  MenuLocation,
} from "@/lib/menu/types";

/**
 * Resolve localized text, falling back to Spanish when the requested language
 * is missing or blank. Spanish is always required by the contract.
 */
export function localize(text: LocalizedText, lang: Language): string {
  if (lang === "es") {
    return text.es;
  }
  const value = text[lang];
  return value && value.trim().length > 0 ? value : text.es;
}

/**
 * Format a whole-COP amount as `$45.000`.
 *
 * Grouping is done manually on purpose: `Intl.NumberFormat` inserts
 * locale-dependent (often non-breaking) whitespace and varies across ICU/Node
 * versions, which makes output non-deterministic and tests brittle.
 */
export function formatPrice(amount: number | null): string {
  if (amount === null) {
    return "";
  }
  const rounded = Math.round(Math.abs(amount));
  const grouped = String(rounded).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const sign = amount < 0 ? "-" : "";
  return `${sign}$${grouped}`;
}

/** Localized short badge label for a featured item kind. */
export function featureBadgeLabel(
  kind: MenuFeatureKind,
  lang: Language,
): string {
  return publicMenuDictionary[lang].badge[kind];
}

/**
 * Order items so available ones come first, keeping the original relative order
 * within each group. Does not mutate the input.
 */
export function sortMenuItems(items: MenuItem[]): MenuItem[] {
  return items
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      if (a.item.available !== b.item.available) {
        return a.item.available ? -1 : 1;
      }
      return a.index - b.index;
    })
    .map((entry) => entry.item);
}

/** Available items flagged with a feature kind, across every category. */
export function getFeaturedItems(
  location: MenuLocation,
  kind: MenuFeatureKind,
): MenuItem[] {
  return location.categories.flatMap((category) =>
    category.items.filter(
      (item) => item.available && (item.features?.includes(kind) ?? false),
    ),
  );
}

/** True when a location has no orderable content to show. */
export function isMenuEmpty(location: MenuLocation): boolean {
  return location.categories.every((category) => category.items.length === 0);
}
