import type { Metadata } from "next";

import { publicMenuDictionary } from "@/lib/i18n/public-menu-dictionary";
import { localize } from "@/lib/menu/format";
import { TAURAS_LOCATIONS } from "@/lib/menu/fixtures";
import { resolveLanguage, resolveLocation } from "@/lib/menu/view";

import { MenuScreen } from "./_components/MenuScreen";

type MenuSearchParams = Promise<{
  venue?: string | string[];
  lang?: string | string[];
}>;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: MenuSearchParams;
}): Promise<Metadata> {
  const { venue, lang: rawLang } = await searchParams;
  const location = resolveLocation(venue);
  const lang = resolveLanguage(rawLang);
  const name = localize(location.name, lang);

  return {
    title: `${name} · Carta Digital Tauras`,
    description: publicMenuDictionary[lang].heroTagline,
  };
}

export default async function MenuPage({
  searchParams,
}: {
  searchParams: MenuSearchParams;
}) {
  const { venue, lang: rawLang } = await searchParams;
  const location = resolveLocation(venue);
  const lang = resolveLanguage(rawLang);

  return (
    <MenuScreen location={location} locations={TAURAS_LOCATIONS} lang={lang} />
  );
}
