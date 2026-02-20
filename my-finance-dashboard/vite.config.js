/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  // Exports the Vite configuration so Vite knows how to run dev, build, and test
  plugins: [react()], // Registers the React plugin. without this, React + JSX will not work
  base: "/NurulRushdinaBinteRosli-Capstone/", // base URL path for GitHub Pages
  test: {
    // Vitest configuration block
    environment: "jsdom", // simulate browser env for testing react components
    globals: true, // allow `describe`, `it`, `expect` without import in test files
    setupFiles: "./setupTests.js", // run before tests
  },
});
