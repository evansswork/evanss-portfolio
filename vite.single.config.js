import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { siteMeta, inlinePublicImages, stripMissingAssets } from './scripts/vite-plugins.mjs';

// Build satu file HTML (untuk preview / dikirim tanpa hosting): npm run build:single
export default defineConfig({
  plugins: [stripMissingAssets(), viteSingleFile(), siteMeta(), inlinePublicImages()],
  build: { outDir: 'dist-single', target: 'es2020', chunkSizeWarningLimit: 2000 },
});
