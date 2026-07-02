// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MenuItemCard } from "@/app/menu/_components/MenuItemCard";
import type { MenuItem } from "@/lib/menu/types";

const ribeye: MenuItem = {
  id: "ojo-de-bife",
  name: { es: "Ojo de Bife", en: "Ribeye" },
  description: { es: "Marmoleo intenso.", en: "Rich marbling." },
  price: 78000,
  currency: "COP",
  available: true,
  features: ["premium_meat"],
};

const withVariants: MenuItem = {
  id: "bife",
  name: { es: "Bife de Chorizo", en: "Sirloin Steak" },
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
  name: { es: "Tomahawk", en: "Tomahawk" },
  price: 180000,
  currency: "COP",
  available: false,
  features: ["premium_meat"],
};

describe("MenuItemCard", () => {
  it("shows localized name, description, price, and badge for an available item", () => {
    render(<MenuItemCard item={ribeye} lang="en" />);
    expect(screen.getByText("Ribeye")).toBeInTheDocument();
    expect(screen.getByText("Rich marbling.")).toBeInTheDocument();
    expect(screen.getByText("$78.000")).toBeInTheDocument();
    expect(screen.getByText("Premium")).toBeInTheDocument();
  });

  it("shows a 'from' price when the item is priced via variants", () => {
    render(<MenuItemCard item={withVariants} lang="es" />);
    expect(screen.getByText(/desde \$62\.000/)).toBeInTheDocument();
  });

  it("marks an unavailable item and does not show it as orderable", () => {
    render(<MenuItemCard item={soldOut} lang="es" />);
    const card = screen.getByRole("article");
    expect(card).toHaveAttribute("data-available", "false");
    expect(screen.getByText("No disponible")).toBeInTheDocument();
  });
});
