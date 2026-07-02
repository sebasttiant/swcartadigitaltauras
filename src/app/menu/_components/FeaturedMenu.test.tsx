// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FeaturedMenu } from "@/app/menu/_components/FeaturedMenu";
import { TAURAS_LOCATIONS } from "@/lib/menu/fixtures";
import type { MenuLocation } from "@/lib/menu/types";

const poblado = TAURAS_LOCATIONS[0] as MenuLocation;

describe("FeaturedMenu", () => {
  it("renders premium, cocktail, and recommended sections in Spanish", () => {
    render(<FeaturedMenu location={poblado} lang="es" />);
    expect(screen.getByText("Carnes premium")).toBeInTheDocument();
    expect(screen.getByText("Cócteles de autor")).toBeInTheDocument();
    expect(screen.getByText("Recomendados")).toBeInTheDocument();
  });

  it("excludes unavailable featured items", () => {
    render(<FeaturedMenu location={poblado} lang="es" />);
    // Tomahawk is a premium meat but unavailable.
    expect(screen.queryByText("Tomahawk")).not.toBeInTheDocument();
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
