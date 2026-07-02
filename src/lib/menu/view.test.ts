import { describe, expect, it } from "vitest";

import { DEFAULT_LOCATION_ID } from "@/lib/menu/fixtures";
import {
  otherLanguage,
  resolveLanguage,
  resolveLocation,
} from "@/lib/menu/view";

describe("resolveLanguage", () => {
  it("defaults to Spanish", () => {
    expect(resolveLanguage(undefined)).toBe("es");
  });

  it("accepts a valid English value", () => {
    expect(resolveLanguage("en")).toBe("en");
  });

  it("falls back to Spanish for unknown or array values", () => {
    expect(resolveLanguage("fr")).toBe("es");
    expect(resolveLanguage(["en", "es"])).toBe("es");
  });
});

describe("otherLanguage", () => {
  it("toggles between the two languages", () => {
    expect(otherLanguage("es")).toBe("en");
    expect(otherLanguage("en")).toBe("es");
  });
});

describe("resolveLocation", () => {
  it("returns the requested location", () => {
    expect(resolveLocation("steakhouse").id).toBe("steakhouse");
  });

  it("falls back to the default location for unknown or missing venue", () => {
    expect(resolveLocation("does-not-exist").id).toBe(DEFAULT_LOCATION_ID);
    expect(resolveLocation(undefined).id).toBe(DEFAULT_LOCATION_ID);
  });
});
