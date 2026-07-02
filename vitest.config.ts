import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Domain foundation is pure TypeScript; no DOM environment needed yet.
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
