import { defineConfig } from "vitest/config";

export default defineConfig({
  base: "/pebble/",
  test: {
    globals: true,
  },
});
