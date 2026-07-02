import { describe, expect, it } from "vitest";

import {
  featureBadgeLabel,
  formatPrice,
  getFeaturedItems,
  isMenuEmpty,
  localize,
  sortMenuItems,
} from "@/lib/menu/format";
import { TAURAS_LOCATIONS } from "@/lib/menu/fixtures";
import type { MenuItem, MenuLocation } from "@/lib/menu/types";

const poblado = TAURAS_LOCATIONS[0] as MenuLocation;

function item(overrides: Partial<MenuItem>): MenuItem {
  return {
    id: "x",
    name: { es: "Item" },
    price: 1000,
    currency: "COP",
    available: true,
    ...overrides,
  };
}

describe("localize", () => {
  it("returns the requested language when present", () => {
    expect(localize({ es: "Hola", en: "Hi" }, "en")).toBe("Hi");
    expect(localize({ es: "Hola", en: "Hi" }, "es")).toBe("Hola");
  });

  it("falls back to Spanish when English is missing", () => {
    expect(localize({ es: "Hola" }, "en")).toBe("Hola");
  });

  it("falls back to Spanish when English is an empty string", () => {
    expect(localize({ es: "Hola", en: "" }, "en")).toBe("Hola");
  });
});

describe("formatPrice", () => {
  it("formats COP with dot thousands separators and a $ prefix", () => {
    expect(formatPrice(45000)).toBe("$45.000");
    expect(formatPrice(1500)).toBe("$1.500");
    expect(formatPrice(900)).toBe("$900");
    expect(formatPrice(118000)).toBe("$118.000");
    expect(formatPrice(0)).toBe("$0");
  });

  it("returns an empty string when there is no price", () => {
    expect(formatPrice(null)).toBe("");
  });

  it("is deterministic and free of locale-dependent whitespace", () => {
    const formatted = formatPrice(1234567);
    expect(formatted).toBe("$1.234.567");
    expect(formatted).not.toMatch(/ /);
  });
});

describe("featureBadgeLabel", () => {
  it("returns the localized badge label", () => {
    expect(featureBadgeLabel("premium_meat", "es")).toBe("Premium");
    expect(featureBadgeLabel("cocktail", "en")).toBe("Cocktail");
    expect(featureBadgeLabel("recommended", "es")).toBe("Recomendado");
  });
});

describe("sortMenuItems", () => {
  it("places available items before unavailable ones, preserving order", () => {
    const a = item({ id: "a", available: true });
    const b = item({ id: "b", available: false });
    const c = item({ id: "c", available: true });
    const d = item({ id: "d", available: false });

    const sorted = sortMenuItems([b, a, d, c]);

    expect(sorted.map((i) => i.id)).toEqual(["a", "c", "b", "d"]);
  });

  it("does not mutate the input array", () => {
    const input = [item({ id: "a", available: false }), item({ id: "b" })];
    const copy = [...input];
    sortMenuItems(input);
    expect(input).toEqual(copy);
  });
});

describe("getFeaturedItems", () => {
  it("collects available items with the given feature across categories", () => {
    const cocktails = getFeaturedItems(poblado, "cocktail");
    expect(cocktails.map((i) => i.id)).toEqual(["negroni", "gin-tonic"]);
  });

  it("excludes unavailable items even when flagged", () => {
    const premium = getFeaturedItems(poblado, "premium_meat");
    expect(premium.map((i) => i.id)).toEqual(["bife-de-chorizo", "ojo-de-bife"]);
    expect(premium.some((i) => i.id === "tomahawk")).toBe(false);
  });

  it("returns an empty array when nothing matches", () => {
    const empty: MenuLocation = {
      id: "empty",
      name: { es: "Vacío" },
      whatsappPhone: "570000000000",
      available: true,
      categories: [],
    };
    expect(getFeaturedItems(empty, "recommended")).toEqual([]);
  });
});

describe("isMenuEmpty", () => {
  it("is true when there are no categories or no items", () => {
    expect(
      isMenuEmpty({
        id: "e",
        name: { es: "e" },
        whatsappPhone: "570000000000",
        available: true,
        categories: [],
      }),
    ).toBe(true);
    expect(
      isMenuEmpty({
        id: "e",
        name: { es: "e" },
        whatsappPhone: "570000000000",
        available: true,
        categories: [{ id: "c", name: { es: "c" }, items: [] }],
      }),
    ).toBe(true);
  });

  it("is false for a location that has items", () => {
    expect(isMenuEmpty(poblado)).toBe(false);
  });
});
