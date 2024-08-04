/// <reference types="vitest" />

import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  test: {
    environmentMatchGlobs: [
      ["**/components/**/*.test.@(js|ts|jsx|tsx)", "jsdom"],
      ["**/!(components)/**/*.test.@(js|ts)", "node"],
    ],

    setupFiles: ["./vitest.setup.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});