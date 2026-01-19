import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';


import { fileURLToPath } from 'url';

// Equivalent of __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: path.resolve(__dirname, '../dist'), // build goes to backend/dist
    emptyOutDir: true,
  },
  base: './',

  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    }
  },
})