/// <reference types="vitest" />

import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environmentMatchGlobs: [
      ["**/components/**/*.test.@(js|ts|jsx|tsx)", "jsdom"],
      ["**/!(components)/**/*.test.@(js|ts)", "node"],
    ],

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
