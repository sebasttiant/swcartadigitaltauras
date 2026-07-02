"use client";

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";

import {
  cartReducer,
  emptyCart,
  type CartAction,
  type CartState,
} from "@/lib/menu/cart";
import type { Language, MenuLocation } from "@/lib/menu/types";

interface CartContextValue {
  state: CartState;
  dispatch: Dispatch<CartAction>;
  location: MenuLocation;
  lang: Language;
}

export const CartContext = createContext<CartContextValue | null>(null);

/** Access the cart. Throws if used outside a CartProvider. */
export function useCart(): CartContextValue {
  const value = useContext(CartContext);
  if (!value) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return value;
}

function storageKey(locationId: string): string {
  return `tauras-cart:${locationId}`;
}

export interface CartProviderProps {
  location: MenuLocation;
  lang: Language;
  children: ReactNode;
}

export function CartProvider({ location, lang, children }: CartProviderProps) {
  const [state, dispatch] = useReducer(cartReducer, location.id, emptyCart);

  // Hydrate after mount so the cart survives the full-page reload that the
  // language switch triggers, while keeping the first render SSR-safe.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey(location.id));
      if (!raw) return;
      const parsed = JSON.parse(raw) as CartState;
      if (parsed.locationId === location.id && Array.isArray(parsed.lines)) {
        dispatch({ type: "hydrate", state: parsed });
      }
    } catch {
      // Corrupt storage is non-fatal: fall back to an empty cart.
    }
  }, [location.id]);

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey(location.id), JSON.stringify(state));
    } catch {
      // Ignore quota/availability errors; the cart still works in memory.
    }
  }, [location.id, state]);

  return (
    <CartContext.Provider value={{ state, dispatch, location, lang }}>
      {children}
    </CartContext.Provider>
  );
}
