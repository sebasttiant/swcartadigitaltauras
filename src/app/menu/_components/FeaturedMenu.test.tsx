// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FeaturedMenu } from "@/app/menu/_components/FeaturedMenu";
import { TAURAS_LOCATIONS } from "@/lib/menu/fixtures";
import type { MenuLocation } from "@/lib/menu/types";

const steakhouse = TAURAS_LOCATIONS.find((l) => l.id === "steakhouse")!;
const barLounge = TAURAS_LOCATIONS.find((l) => l.id === "bar-lounge")!;

describe("FeaturedMenu", () => {
  it("renders the featured sections present for the brand, in Spanish", () => {
    render(<FeaturedMenu location={steakhouse} lang="es" />);
    expect(screen.getByText("Carnes premium")).toBeInTheDocument();
    expect(screen.getByText("Recomendados")).toBeInTheDocument();
  });

  it("shows the cocktail section for a brand that has cocktails", () => {
    render(<FeaturedMenu location={barLounge} lang="es" />);
    expect(screen.getByText("Cócteles de autor")).toBeInTheDocument();
  });

  it("excludes unavailable featured items", () => {
    render(<FeaturedMenu location={steakhouse} lang="es" />);
    // Entraña is a premium meat but unavailable.
    expect(screen.queryByText("Entraña 350 g")).not.toBeInTheDocument();
  });

  it("renders nothing when there are no featured items", () => {
    const empty: MenuLocation = {
      id: "empty",
      name: { es: "Vacío" },
      whatsappPhone: "570000000000",
      available: true,
      categories: [],
    };
    const { container } = render(<FeaturedMenu location={empty} lang="es" />);
    expect(container).toBeEmptyDOMElement();
  });
});
