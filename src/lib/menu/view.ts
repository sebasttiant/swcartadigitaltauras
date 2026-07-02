import {
  DEFAULT_LOCATION_ID,
  findLocation,
  TAURAS_LOCATIONS,
} from "@/lib/menu/fixtures";
import { DEFAULT_LANGUAGE, LANGUAGES } from "@/lib/menu/types";
import type { Language, MenuLocation } from "@/lib/menu/types";

/** A raw search-param value as delivered by Next (string, repeated, or absent). */
type SearchParamValue = string | string[] | undefined;

/** Resolve a language search param, defaulting to Spanish for anything invalid. */
export function resolveLanguage(raw: SearchParamValue): Language {
  return typeof raw === "string" &&
    (LANGUAGES as readonly string[]).includes(raw)
    ? (raw as Language)
    : DEFAULT_LANGUAGE;
}

/** The opposite language, used to label the always-visible switch. */
export function otherLanguage(lang: Language): Language {
  return lang === "es" ? "en" : "es";
}

/**
 * Resolve a venue search param to a known location, falling back to the default
 * sede for unknown or missing venues so the page never renders empty by mistake.
 */
export function resolveLocation(raw: SearchParamValue): MenuLocation {
  const fallback = findLocation(DEFAULT_LOCATION_ID);
  if (!fallback) {
    throw new Error(
      `Default location "${DEFAULT_LOCATION_ID}" is missing from fixtures`,
    );
  }
  if (typeof raw !== "string") {
    return fallback;
  }
  return findLocation(raw) ?? fallback;
}

/** Lightweight tab descriptors for the location switcher. */
export function locationTabs(): MenuLocation[] {
  return TAURAS_LOCATIONS;
}
