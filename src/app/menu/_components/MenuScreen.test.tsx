// @vitest-environment jsdom
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MenuScreen } from "@/app/menu/_components/MenuScreen";
import { TAURAS_LOCATIONS } from "@/lib/menu/fixtures";
import type { MenuLocation } from "@/lib/menu/types";

const poblado = TAURAS_LOCATIONS[0] as MenuLocation;

function renderScreen(lang: "es" | "en") {
  return render(
    <MenuScreen location={poblado} locations={TAURAS_LOCATIONS} lang={lang} />,
  );
}

describe("MenuScreen", () => {
  it("renders the sede name, category headings, and items", () => {
    renderScreen("es");
    expect(screen.getAllByText("Tauras El Poblado").length).toBeGreaterThan(0);
    expect(screen.getByRole("heading", { name: "Carnes" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Cócteles" }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Ojo de Bife").length).toBeGreaterThan(0);
  });

  it("uses English labels when lang is en", () => {
    renderScreen("en");
    expect(
      screen.getByRole("heading", { name: "Steaks" }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Ribeye").length).toBeGreaterThan(0);
  });

  it("exposes an always-visible language switch to the other language", () => {
    renderScreen("es");
    const link = screen.getByRole("link", { name: /English/ });
    expect(link).toHaveAttribute("href", "?venue=poblado&lang=en");
  });

  it("renders a navigable tab for each location", () => {
    renderScreen("es");
    const nav = screen.getByRole("navigation", { name: /sede|location/i });
    expect(
      within(nav).getByRole("link", { name: /Tauras El Poblado/ }),
    ).toBeInTheDocument();
  });

  it("shows unavailable items as not orderable", () => {
    renderScreen("es");
    // Tomahawk is unavailable; it appears in the full listing marked as such.
    const tomahawk = screen.getByText("Tomahawk").closest("article");
    expect(tomahawk).toHaveAttribute("data-available", "false");
  });
});
