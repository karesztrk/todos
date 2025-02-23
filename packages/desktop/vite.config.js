import { defineConfig, searchForWorkspaceRoot } from "vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { browserslistToTargets } from "lightningcss";
import browserslist from "browserslist";

// @ts-expect-error process is a nodejs global
const host = process.env.TAURI_DEV_HOST;

export default defineConfig({
  plugins: [sveltekit()],
  css: {
    transformer: "lightningcss",
    lightningcss: {
      targets: browserslistToTargets(
        browserslist(">0.3%, last 2 versions, not dead"),
      ),
    },
  },
  build: {
    cssMinify: "lightningcss",
  },
  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
    fs: {
      allow: [
        // @ts-expect-error search up for workspace root
        searchForWorkspaceRoot(process.cwd()),
      ],
    },
  },
});
