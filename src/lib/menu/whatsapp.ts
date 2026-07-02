import { publicMenuDictionary } from "@/lib/i18n/public-menu-dictionary";
import { formatPrice, localize } from "@/lib/menu/format";
import type {
  Language,
  MenuItem,
  MenuItemOption,
  MenuItemVariant,
  MenuLocation,
} from "@/lib/menu/types";

/** A single line in the local cart: an item plus its chosen variant/options. */
export interface CartLine {
  item: MenuItem;
  quantity: number;
  variant?: MenuItemVariant;
  options?: MenuItemOption[];
}

export interface WhatsAppOrderInput {
  location: MenuLocation;
  lines: CartLine[];
  lang: Language;
  notes?: string;
}

/** Unit price: variant price (or base price), plus any option deltas. */
export function lineUnitPrice(line: CartLine): number {
  const base = line.variant ? line.variant.price : (line.item.price ?? 0);
  const optionsDelta = (line.options ?? []).reduce(
    (sum, option) => sum + (option.priceDelta ?? 0),
    0,
  );
  return base + optionsDelta;
}

export function lineSubtotal(line: CartLine): number {
  return lineUnitPrice(line) * line.quantity;
}

export function orderTotal(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + lineSubtotal(line), 0);
}

function formatLine(line: CartLine, lang: Language): string {
  const name = localize(line.item.name, lang);
  const parts: string[] = [`${line.quantity} x ${name}`];
  if (line.variant) {
    parts.push(`(${localize(line.variant.label, lang)})`);
  }
  if (line.options && line.options.length > 0) {
    const optionLabels = line.options
      .map((option) => localize(option.label, lang))
      .join(", ");
    parts.push(`[${optionLabels}]`);
  }
  const subtotal = formatPrice(lineSubtotal(line));
  const suffix = subtotal ? ` — ${subtotal}` : "";
  return `- ${parts.join(" ")}${suffix}`;
}

/** Compose the human-readable WhatsApp order message in the chosen language. */
export function buildWhatsAppMessage(input: WhatsAppOrderInput): string {
  const { location, lines, lang, notes } = input;
  const copy = publicMenuDictionary[lang].whatsapp;
  const locationName = localize(location.name, lang);

  const blocks: string[] = [
    `${copy.greeting} ${locationName}.`,
    `${copy.orderTitle}:\n${lines.map((line) => formatLine(line, lang)).join("\n")}`,
  ];

  if (notes && notes.trim().length > 0) {
    blocks.push(`${copy.notesLabel}: ${notes.trim()}`);
  }

  const total = orderTotal(lines);
  if (total > 0) {
    blocks.push(`${copy.totalLabel}: ${formatPrice(total)}`);
  }

  blocks.push(copy.disclaimer);

  return blocks.join("\n\n");
}

/** Build the `https://wa.me/<phone>?text=<encoded>` deep link for the order. */
export function buildWhatsAppMenuUrl(input: WhatsAppOrderInput): string {
  const phone = input.location.whatsappPhone.replace(/\D/g, "");
  const message = buildWhatsAppMessage(input);
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
