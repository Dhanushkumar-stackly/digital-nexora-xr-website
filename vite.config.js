import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Assign by package path. The object form of manualChunks also pulls shared
// dependencies (e.g. React's JSX runtime) into the 3D chunks, which made the
// first page load download three.js.
const chunkFor = (id) => {
  // Vite's lazy-import helper otherwise lands in the drei chunk, which drags 3D into the first load.
  if (id.includes("vite/preload-helper")) return "vendor";
  if (!id.includes("node_modules")) return undefined;
  if (/node_modules[\\/]three[\\/]/.test(id)) return "three_core";
  if (id.includes("@react-three/fiber")) return "r3f";
  if (id.includes("@react-three/drei")) return "drei";
  if (/node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/.test(id)) return "vendor";
  return undefined;
};

// https://vitejs.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  optimizeDeps: {
    include: ['@emailjs/browser', 'react-toastify']
  },
  resolve: isSsrBuild
    ? {
        // The prerender runs in Node, where WebGL scenes can't render; swap them for an empty component.
        alias: [
          {
            find: /^.*\/canvas\/(HeroNetwork|SeoScene|Earth|Stars)$/,
            replacement: fileURLToPath(new URL("./src/ssr/EmptyCanvas.tsx", import.meta.url)),
          },
        ],
      }
    : undefined,
  build: {
    rollupOptions: isSsrBuild ? {} : { output: { manualChunks: chunkFor } },
    // raise warning limit to 1000 KB (1 MB) — still shows warnings for very large chunks
    chunkSizeWarningLimit: 1000
  }
}));
