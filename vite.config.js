import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['@emailjs/browser', 'react-toastify']
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // split common vendor libs into a separate chunk
          vendor: ['react', 'react-dom', 'react-router-dom', 'react-toastify'],
          // split 3D-related libs into smaller chunks for better caching and smaller downloads
          three_core: ['three'],
          r3f: ['@react-three/fiber'],
          drei: ['@react-three/drei'],
        },
      }
    },
    // raise warning limit to 1000 KB (1 MB) — still shows warnings for very large chunks
    chunkSizeWarningLimit: 1000
  }
});
