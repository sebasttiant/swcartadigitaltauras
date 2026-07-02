/**
 * Domain contracts for the public digital menu.
 *
 * These DTOs are the stable contract used by fixtures now and by a future
 * Prisma/Postgres catalog later. Persistence must map onto these shapes rather
 * than leaking database concerns into the UI.
 */

export const LANGUAGES = ["es", "en"] as const;
export type Language = (typeof LANGUAGES)[number];

export const DEFAULT_LANGUAGE: Language = "es";

/** Spanish is the source of truth; English is optional and falls back to Spanish. */
export interface LocalizedText {
  es: string;
  en?: string;
}

export const MENU_FEATURE_KINDS = [
  "premium_meat",
  "cocktail",
  "recommended",
] as const;
export type MenuFeatureKind = (typeof MENU_FEATURE_KINDS)[number];

/** A priced size/cut variant, e.g. "300g" vs "500g". Overrides the base price. */
export interface MenuItemVariant {
  id: string;
  label: LocalizedText;
  price: number;
}

/** An add-on that adjusts the line price, e.g. "extra chimichurri". */
export interface MenuItemOption {
  id: string;
  label: LocalizedText;
  priceDelta?: number;
}

export interface MenuItem {
  id: string;
  name: LocalizedText;
  description?: LocalizedText;
  /** Base price in whole COP. `null` when the price is expressed only via variants. */
  price: number | null;
  /** ISO currency code. MVP ships COP only. */
  currency: string;
  available: boolean;
  features?: MenuFeatureKind[];
  variants?: MenuItemVariant[];
  options?: MenuItemOption[];
  imageUrl?: string;
}

export interface MenuCategory {
  id: string;
  name: LocalizedText;
  items: MenuItem[];
}

export interface MenuLocation {
  id: string;
  name: LocalizedText;
  /** Digits only in E.164 form without the leading '+', e.g. "573001112233". */
  whatsappPhone: string;
  available: boolean;
  categories: MenuCategory[];
}
