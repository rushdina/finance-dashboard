/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/NurulRushdinaBinteRosli-Capstone/", // for GitHub Pages
  test: {
    environment: "jsdom", // simulate browser
    globals: true, // allow `describe`, `it`, `expect` without import
    setupFiles: "./src/setupTests.js", // run before tests
  },
});
