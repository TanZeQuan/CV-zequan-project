import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  base: './',
  plugins: [react()],
  resolve: { preserveSymlinks: true },
  server: { host: '127.0.0.1', port: 4175, strictPort: true },
  build: mode === 'standalone' ? {
    outDir: 'standalone',
    cssCodeSplit: false,
    rollupOptions: { output: { format: 'iife', inlineDynamicImports: true, entryFileNames: 'assets/app.js' } },
  } : {},
}))
