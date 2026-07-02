// @vitest-environment jsdom
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MenuScreen } from "@/app/menu/_components/MenuScreen";
import { TAURAS_LOCATIONS } from "@/lib/menu/fixtures";
import type { MenuLocation } from "@/lib/menu/types";

const steakhouse = TAURAS_LOCATIONS[0] as MenuLocation;

function renderScreen(lang: "es" | "en") {
  return render(
    <MenuScreen location={steakhouse} locations={TAURAS_LOCATIONS} lang={lang} />,
  );
}

describe("MenuScreen", () => {
  it("renders the brand name, category headings, and items", () => {
    renderScreen("es");
    expect(screen.getAllByText("Tauras Steakhouse").length).toBeGreaterThan(0);
    expect(
      screen.getByRole("heading", { name: "Parrilla importada" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Entradas" }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Brisket").length).toBeGreaterThan(0);
  });

  it("uses English labels when lang is en", () => {
    renderScreen("en");
    expect(
      screen.getByRole("heading", { name: "Imported grill" }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Ribeye 400 g").length).toBeGreaterThan(0);
  });

  it("exposes an always-visible language switch to the other language", () => {
    renderScreen("es");
    const link = screen.getByRole("link", { name: /English/ });
    expect(link).toHaveAttribute("href", "?venue=steakhouse&lang=en");
  });

  it("renders a navigable tab for each location", () => {
    renderScreen("es");
    const nav = screen.getByRole("navigation", { name: /sede|location/i });
    expect(
      within(nav).getByRole("link", { name: /Tauras Steakhouse/ }),
    ).toBeInTheDocument();
  });

  it("shows unavailable items as not orderable", () => {
    renderScreen("es");
    // Entraña is unavailable; it appears in the full listing marked as such.
    const entrana = screen.getByText("Entraña 350 g").closest("article");
    expect(entrana).toHaveAttribute("data-available", "false");
  });
});
