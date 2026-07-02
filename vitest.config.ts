import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    // Default to node for pure-domain tests; component tests opt into jsdom via
    // a `// @vitest-environment jsdom` docblock so they stay fast to run.
    environment: "node",
    // Enables Testing Library's automatic DOM cleanup between tests.
    globals: true,
    setupFiles: ["src/test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
