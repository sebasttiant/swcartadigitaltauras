import { describe, expect, it } from "vitest";

import {
  cartCount,
  cartReducer,
  cartTotal,
  emptyCart,
  lineKey,
  type CartAction,
  type CartState,
} from "@/lib/menu/cart";
import type { MenuItem } from "@/lib/menu/types";

const negroni: MenuItem = {
  id: "negroni",
  name: { es: "Negroni" },
  price: 28000,
  currency: "COP",
  available: true,
};

const bife: MenuItem = {
  id: "bife",
  name: { es: "Bife de Chorizo" },
  price: null,
  currency: "COP",
  available: true,
  variants: [
    { id: "300g", label: { es: "300 g" }, price: 62000 },
    { id: "500g", label: { es: "500 g" }, price: 92000 },
  ],
};

const soldOut: MenuItem = {
  id: "tomahawk",
  name: { es: "Tomahawk" },
  price: 180000,
  currency: "COP",
  available: false,
};

function reduce(state: CartState, ...actions: CartAction[]): CartState {
  return actions.reduce(cartReducer, state);
}

describe("cartReducer add", () => {
  it("adds an available item as a new line with quantity 1", () => {
    const state = reduce(emptyCart(), {
      type: "add",
      locationId: "poblado",
      item: negroni,
    });
    expect(state.lines).toHaveLength(1);
    expect(state.lines[0]?.quantity).toBe(1);
    expect(state.locationId).toBe("poblado");
  });

  it("increments quantity when the same line is added again", () => {
    const add: CartAction = { type: "add", locationId: "poblado", item: negroni };
    const state = reduce(emptyCart(), add, add);
    expect(state.lines).toHaveLength(1);
    expect(state.lines[0]?.quantity).toBe(2);
  });

  it("keeps different variants of the same item as separate lines", () => {
    const state = reduce(
      emptyCart(),
      { type: "add", locationId: "poblado", item: bife, variant: bife.variants![0] },
      { type: "add", locationId: "poblado", item: bife, variant: bife.variants![1] },
    );
    expect(state.lines).toHaveLength(2);
  });

  it("blocks unavailable items", () => {
    const state = reduce(emptyCart(), {
      type: "add",
      locationId: "poblado",
      item: soldOut,
    });
    expect(state.lines).toHaveLength(0);
  });

  it("resets the cart when adding from a different sede", () => {
    const state = reduce(
      emptyCart(),
      { type: "add", locationId: "poblado", item: negroni },
      { type: "add", locationId: "laureles", item: negroni },
    );
    expect(state.locationId).toBe("laureles");
    expect(state.lines).toHaveLength(1);
  });
});

describe("cartReducer edits", () => {
  const base = reduce(emptyCart(), {
    type: "add",
    locationId: "poblado",
    item: negroni,
  });
  const key = lineKey(base.lines[0]!);

  it("increments and decrements a line", () => {
    const up = cartReducer(base, { type: "increment", key });
    expect(up.lines[0]?.quantity).toBe(2);
    const down = cartReducer(up, { type: "decrement", key });
    expect(down.lines[0]?.quantity).toBe(1);
  });

  it("removes a line when quantity drops to zero", () => {
    const state = cartReducer(base, { type: "decrement", key });
    expect(state.lines).toHaveLength(0);
  });

  it("sets an explicit quantity and removes on zero", () => {
    expect(cartReducer(base, { type: "setQuantity", key, quantity: 4 }).lines[0]?.quantity).toBe(4);
    expect(cartReducer(base, { type: "setQuantity", key, quantity: 0 }).lines).toHaveLength(0);
  });

  it("removes and clears", () => {
    expect(cartReducer(base, { type: "remove", key }).lines).toHaveLength(0);
    expect(cartReducer(base, { type: "clear" }).lines).toHaveLength(0);
  });
});

describe("cart selectors", () => {
  const state = reduce(
    emptyCart(),
    { type: "add", locationId: "poblado", item: negroni },
    { type: "add", locationId: "poblado", item: negroni },
    { type: "add", locationId: "poblado", item: bife, variant: bife.variants![0] },
  );

  it("counts total quantity", () => {
    expect(cartCount(state)).toBe(3);
  });

  it("totals the cart", () => {
    // 28000 * 2 + 62000 = 118000
    expect(cartTotal(state)).toBe(118000);
  });
});
