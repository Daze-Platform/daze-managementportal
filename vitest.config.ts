import { defineConfig } from "vitest/config";
import path from "path";

// Pure-logic unit tests run in a node environment (no DOM needed). The `@`
// alias mirrors vite.config.ts so test imports resolve the same way.
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
});
