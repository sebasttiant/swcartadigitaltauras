import type { MenuItem, MenuItemOption, MenuItemVariant } from "@/lib/menu/types";
import { orderTotal, type CartLine } from "@/lib/menu/whatsapp";

export type { CartLine } from "@/lib/menu/whatsapp";

/** A local, sede-scoped cart. Never persisted server-side. */
export interface CartState {
  /** The sede this cart belongs to; a cart never mixes locations. */
  locationId: string | null;
  lines: CartLine[];
}

export type CartAction =
  | { type: "hydrate"; state: CartState }
  | {
      type: "add";
      locationId: string;
      item: MenuItem;
      variant?: MenuItemVariant;
      options?: MenuItemOption[];
    }
  | { type: "increment"; key: string }
  | { type: "decrement"; key: string }
  | { type: "setQuantity"; key: string; quantity: number }
  | { type: "remove"; key: string }
  | { type: "clear" };

export function emptyCart(locationId: string | null = null): CartState {
  return { locationId, lines: [] };
}

/** Stable identity of a line: item + variant + sorted options. */
export function lineKey(line: CartLine): string {
  const variantId = line.variant?.id ?? "";
  const optionIds = (line.options ?? [])
    .map((option) => option.id)
    .sort()
    .join(",");
  return `${line.item.id}::${variantId}::${optionIds}`;
}

function mapLine(
  lines: CartLine[],
  key: string,
  update: (line: CartLine) => CartLine | null,
): CartLine[] {
  return lines.flatMap((line) => {
    if (lineKey(line) !== key) {
      return [line];
    }
    const next = update(line);
    return next ? [next] : [];
  });
}

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "hydrate":
      return action.state;

    case "add": {
      if (!action.item.available) {
        return state;
      }
      // A cart belongs to a single sede; switching sede starts a fresh cart.
      const base: CartState =
        state.locationId !== null && state.locationId !== action.locationId
          ? emptyCart(action.locationId)
          : { ...state, locationId: action.locationId };

      const newLine: CartLine = {
        item: action.item,
        quantity: 1,
        ...(action.variant ? { variant: action.variant } : {}),
        ...(action.options ? { options: action.options } : {}),
      };
      const key = lineKey(newLine);
      const existing = base.lines.find((line) => lineKey(line) === key);

      if (existing) {
        return {
          ...base,
          lines: mapLine(base.lines, key, (line) => ({
            ...line,
            quantity: line.quantity + 1,
          })),
        };
      }
      return { ...base, lines: [...base.lines, newLine] };
    }

    case "increment":
      return {
        ...state,
        lines: mapLine(state.lines, action.key, (line) => ({
          ...line,
          quantity: line.quantity + 1,
        })),
      };

    case "decrement":
      return {
        ...state,
        lines: mapLine(state.lines, action.key, (line) =>
          line.quantity <= 1 ? null : { ...line, quantity: line.quantity - 1 },
        ),
      };

    case "setQuantity":
      return {
        ...state,
        lines: mapLine(state.lines, action.key, (line) =>
          action.quantity <= 0 ? null : { ...line, quantity: action.quantity },
        ),
      };

    case "remove":
      return {
        ...state,
        lines: state.lines.filter((line) => lineKey(line) !== action.key),
      };

    case "clear":
      return { ...state, lines: [] };
  }
}

export function cartCount(state: CartState): number {
  return state.lines.reduce((sum, line) => sum + line.quantity, 0);
}

export function cartTotal(state: CartState): number {
  return orderTotal(state.lines);
}
