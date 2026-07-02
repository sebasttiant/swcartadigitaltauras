import { publicMenuDictionary } from "@/lib/i18n/public-menu-dictionary";
import { otherLanguage } from "@/lib/menu/view";
import type { Language } from "@/lib/menu/types";

import styles from "./menu.module.css";

export interface LanguageSwitchProps {
  lang: Language;
  venue: string;
}

/**
 * Server-rendered language toggle: a plain link that swaps the `lang` query
 * param. No client JS needed, so the switch is always visible and SEO-safe.
 */
export function LanguageSwitch({ lang, venue }: LanguageSwitchProps) {
  const target = otherLanguage(lang);
  const copy = publicMenuDictionary[lang];
  const targetName = publicMenuDictionary[target].languageName;

  return (
    <a
      className={styles.switch}
      href={`?venue=${venue}&lang=${target}`}
      hrefLang={target}
      aria-label={`Ver en ${targetName} / View in ${targetName}`}
    >
      {copy.switchLabel}
    </a>
  );
}
