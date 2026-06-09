import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";
import contentCollections from "@content-collections/vite";
import path from "node:path";

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    contentCollections(),
    nitro({ rollupConfig: { external: [/^@sentry\//] } }),
    tailwindcss(),
    tanstackStart({
      router: {
        routesDirectory: path.resolve(process.cwd(), "src/routes"),
        generatedRouteTree: "src/routeTree.gen.ts",
      },
      prerender: {
        enabled: true, // Enables Static Site Generation
        crawlLinks: false, // Automatically follows links to prerender all pages
        autoSubfolderIndex: true, // Outputs as clean /page/index.html
      },
    }),
    viteReact(),
  ],
});

export default config;
