import { describe, expect, it } from "vitest";

import {
  buildWhatsAppMenuUrl,
  buildWhatsAppMessage,
  lineSubtotal,
  lineUnitPrice,
  orderTotal,
  type CartLine,
} from "@/lib/menu/whatsapp";
import type { MenuItem, MenuLocation } from "@/lib/menu/types";

const location: MenuLocation = {
  id: "poblado",
  name: { es: "Tauras El Poblado", en: "Tauras El Poblado" },
  whatsappPhone: "573001112233",
  available: true,
  categories: [],
};

const bife: MenuItem = {
  id: "bife",
  name: { es: "Bife de Chorizo", en: "Sirloin Steak" },
  price: null,
  currency: "COP",
  available: true,
  variants: [
    { id: "300g", label: { es: "300 g", en: "300 g" }, price: 62000 },
    { id: "500g", label: { es: "500 g", en: "500 g" }, price: 92000 },
  ],
  options: [
    {
      id: "chimichurri",
      label: { es: "Chimichurri extra", en: "Extra chimichurri" },
      priceDelta: 4000,
    },
  ],
};

const negroni: MenuItem = {
  id: "negroni",
  name: { es: "Negroni", en: "Negroni" },
  price: 28000,
  currency: "COP",
  available: true,
};

describe("lineUnitPrice", () => {
  it("uses the base item price when no variant is chosen", () => {
    expect(lineUnitPrice({ item: negroni, quantity: 1 })).toBe(28000);
  });

  it("uses the variant price over the base price", () => {
    expect(
      lineUnitPrice({ item: bife, quantity: 1, variant: bife.variants![1] }),
    ).toBe(92000);
  });

  it("adds option price deltas", () => {
    expect(
      lineUnitPrice({
        item: bife,
        quantity: 1,
        variant: bife.variants![0],
        options: bife.options,
      }),
    ).toBe(66000);
  });

  it("treats a missing price as zero", () => {
    expect(lineUnitPrice({ item: bife, quantity: 2 })).toBe(0);
  });
});

describe("lineSubtotal and orderTotal", () => {
  it("multiplies unit price by quantity", () => {
    expect(lineSubtotal({ item: negroni, quantity: 3 })).toBe(84000);
  });

  it("sums every line subtotal", () => {
    const lines: CartLine[] = [
      { item: negroni, quantity: 2 },
      { item: bife, quantity: 1, variant: bife.variants![0] },
    ];
    expect(orderTotal(lines)).toBe(118000);
  });
});

describe("buildWhatsAppMessage", () => {
  const lines: CartLine[] = [
    {
      item: bife,
      quantity: 2,
      variant: bife.variants![1],
      options: bife.options,
    },
    { item: negroni, quantity: 1 },
  ];

  it("includes greeting, location, item lines, and total in Spanish", () => {
    const message = buildWhatsAppMessage({ location, lines, lang: "es" });
    expect(message).toContain("Tauras El Poblado");
    expect(message).toContain("2 x Bife de Chorizo");
    expect(message).toContain("500 g");
    expect(message).toContain("Chimichurri extra");
    expect(message).toContain("1 x Negroni");
    expect(message).toContain("Total estimado");
    // (92000 + 4000) * 2 + 28000 = 220000
    expect(message).toContain("$220.000");
  });

  it("uses English copy and item names when lang is en", () => {
    const message = buildWhatsAppMessage({ location, lines, lang: "en" });
    expect(message).toContain("Sirloin Steak");
    expect(message).toContain("Estimated total");
    expect(message).not.toContain("Total estimado");
  });

  it("includes notes only when provided", () => {
    const withNotes = buildWhatsAppMessage({
      location,
      lines,
      lang: "es",
      notes: "Sin sal, por favor",
    });
    expect(withNotes).toContain("Sin sal, por favor");

    const withoutNotes = buildWhatsAppMessage({ location, lines, lang: "es" });
    expect(withoutNotes).not.toContain("Notas");
  });

  it("always appends the confirmation disclaimer", () => {
    const message = buildWhatsAppMessage({ location, lines, lang: "es" });
    expect(message).toContain("debe confirmarse");
  });
});

describe("buildWhatsAppMenuUrl", () => {
  const lines: CartLine[] = [{ item: negroni, quantity: 1 }];

  it("targets wa.me with a digits-only phone", () => {
    const url = buildWhatsAppMenuUrl({ location, lines, lang: "es" });
    expect(url.startsWith("https://wa.me/573001112233?text=")).toBe(true);
  });

  it("strips non-digit characters from the phone", () => {
    const url = buildWhatsAppMenuUrl({
      location: { ...location, whatsappPhone: "+57 (300) 111-2233" },
      lines,
      lang: "es",
    });
    expect(url.startsWith("https://wa.me/573001112233?text=")).toBe(true);
  });

  it("URL-encodes the message so it round-trips", () => {
    const url = buildWhatsAppMenuUrl({ location, lines, lang: "es" });
    const encoded = url.split("?text=")[1] as string;
    const message = buildWhatsAppMessage({ location, lines, lang: "es" });
    expect(decodeURIComponent(encoded)).toBe(message);
    expect(encoded).not.toContain(" ");
  });
});
