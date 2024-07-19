/// <reference types="vitest" />

import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  test: {
    environmentMatchGlobs: [
      ["**/**.test.*", "node"],
      ["**/components/*.test.@(js|ts|jsx|tsx)", "jsdom"],
    ],

    /**
     * WARNING!!!
     * Jika test dilakukan dilingkungan `node`, maka setup files perlu dimatikan secara manual.
     * Tebakan kasar, ini karena setup files dibangun hanya untuk lingkungan `jsdom` saja.
     */
    setupFiles: ["./vitest.setup.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});