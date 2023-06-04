import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import autoprefixer from "autoprefixer";

export default defineConfig({
  plugins: [vue()],
  build: {
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': 'src',
    },
  },
  css: {
    postcss: {
      plugins: [
        autoprefixer(),
      ],
    },
  },
  server: {
    strictPort: true,
    port: 3000,
    host: '0.0.0.0',
  },
  preview: {
    strictPort: true,
    port: 3000,
    host: '0.0.0.0',
  },
})
