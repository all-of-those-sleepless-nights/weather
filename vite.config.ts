import path from "node:path";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    // The real key never reaches tests; MSW intercepts every request.
    env: { VITE_OPENWEATHER_API_KEY: "test-key" },
    css: false,
  },
  // In production the OpenWeather key belongs on a server, not in the bundle.
  // A BFF would sit here instead, holding the key and exposing a key-less route:
  //
  // server: {
  //   proxy: {
  //     "/api/weather": {
  //       target: "https://api.openweathermap.org",
  //       changeOrigin: true,
  //       rewrite: (p) => p.replace(/^\/api\/weather/, "/data/2.5/weather"),
  //     },
  //   },
  // },
});
