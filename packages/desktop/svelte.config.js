// Tauri doesn't have a Node.js server to do proper SSR
// so we will use adapter-static to prerender the app (SSG)
// See: https://v2.tauri.app/start/frontend/sveltekit/ for more info
import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(),
    alias: {
      "@todotrk/web/style/*": "../web/src/style/*",
      "@todotrk/web/components/*": "../web/src/lib/components/*",
      "@todotrk/web/repository/*": "../web/src/lib/repository/*",
    },
  },
};

export default config;
