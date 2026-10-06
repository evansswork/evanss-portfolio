import { defineConfig } from 'vite';
import { siteMeta, stripMissingAssets } from './scripts/vite-plugins.mjs';

// Build situs untuk Vercel (output: dist/)
export default defineConfig({
  plugins: [stripMissingAssets(), siteMeta()],
  build: {
    outDir: 'dist',
    target: 'es2020',
    cssCodeSplit: false,
    chunkSizeWarningLimit: 700, // three.js memang ±560 KB (±145 KB gzip) dan dipisah ke chunk sendiri
    rollupOptions: {
      output: {
        // vendor dipisah supaya cache browser bertahan saat konten berubah
        manualChunks(id) {
          if (id.includes('node_modules/three')) return 'three';
          if (id.includes('node_modules/gsap')) return 'gsap';
          if (id.includes('node_modules/lenis')) return 'lenis';
        },
      },
    },
  },
});
