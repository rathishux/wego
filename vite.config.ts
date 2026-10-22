import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
  // GitHub Pages serves this app from /wego/. Vercel and the Capacitor native
  // app (whose WebView serves the built files at its own root, with no
  // subpath) both need the plain root instead.
  const base = process.env.VERCEL || mode === "capacitor" ? "/" : "/wego/";

  return {
    base,
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: ["icon.svg"],
        manifest: {
          name: "NivYou — Wegovy & Prediabetes Tracker",
          short_name: "NivYou",
          description: "Private Wegovy and prediabetes tracking app",
          theme_color: "#1f6f50",
          background_color: "#f4f6f5",
          display: "standalone",
          start_url: base,
          scope: base,
          icons: [
            {
              src: "icon.svg",
              sizes: "any",
              type: "image/svg+xml",
              purpose: "any maskable",
            },
          ],
        },
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
