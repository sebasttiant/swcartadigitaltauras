// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { AddToCartControls } from "@/app/menu/_components/AddToCartControls";
import { CartBar } from "@/app/menu/_components/CartBar";
import { CartProvider } from "@/app/menu/_components/CartProvider";
import { TAURAS_LOCATIONS } from "@/lib/menu/fixtures";
import type { MenuItem, MenuLocation } from "@/lib/menu/types";

const poblado = TAURAS_LOCATIONS[0] as MenuLocation;

const negroni: MenuItem = {
  id: "negroni",
  name: { es: "Negroni", en: "Negroni" },
  price: 28000,
  currency: "COP",
  available: true,
};

const soldOut: MenuItem = {
  id: "tomahawk",
  name: { es: "Tomahawk", en: "Tomahawk" },
  price: 180000,
  currency: "COP",
  available: false,
};

function renderIsland() {
  return render(
    <CartProvider location={poblado} lang="es">
      <AddToCartControls item={negroni} />
      <AddToCartControls item={soldOut} />
      <CartBar />
    </CartProvider>,
  );
}

describe("cart island", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("does not render an add control for unavailable items", () => {
    renderIsland();
    expect(
      screen.queryByRole("button", { name: /Tomahawk/i }),
    ).not.toBeInTheDocument();
  });

  it("hides the cart bar until something is added", () => {
    renderIsland();
    expect(
      screen.queryByRole("link", { name: /WhatsApp/i }),
    ).not.toBeInTheDocument();
  });

  it("adds an item and shows the running total", () => {
    renderIsland();
    fireEvent.click(screen.getByRole("button", { name: /Agregar Negroni/i }));
    expect(screen.getByText("$28.000")).toBeInTheDocument();
  });

  it("exposes a WhatsApp hand-off link for the sede once the cart has items", () => {
    renderIsland();
    fireEvent.click(screen.getByRole("button", { name: /Agregar Negroni/i }));
    const link = screen.getByRole("link", { name: /WhatsApp/i });
    expect(link.getAttribute("href")).toMatch(
      /^https:\/\/wa\.me\/573001112233\?text=/,
    );
  });
});
