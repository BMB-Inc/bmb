import { defineConfig } from 'vite'
// @ts-ignore
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@schemas': resolve(__dirname, './src/schemas'),
      '@api': resolve(__dirname, './src/api'),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist-app',
  },
})
