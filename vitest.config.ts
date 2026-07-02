import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    // Domain foundation is pure TypeScript; no DOM environment needed yet.
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
