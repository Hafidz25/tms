/// <reference types="vitest" />

import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    deps: {
      optimizer: {
        web: {
          include: ["react-tweet"],
        },
      },
      inline: ["react-tweet"],
    },
    server: {
      deps: {
        inline: ["react-tweet"],
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});
