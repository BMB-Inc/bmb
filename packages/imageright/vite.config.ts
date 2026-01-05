import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@api': resolve(__dirname, './src/api'),
      '@hooks': resolve(__dirname, './src/hooks'),
      '@components': resolve(__dirname, './src/components'),
      '@modules': resolve(__dirname, './src/modules'),
      '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs',
    },
  },
  server: {
    port: 5174, // Use safe port (6666 is blocked by browsers as "dangerous port")
    strictPort: true, // Fail if port is already in use
    // Allow access from staging domain through nginx proxy
    hmr: {
      clientPort: 443, // Use HTTPS port for HMR when accessed via staging
    }
  },
  base: '/dev/', // Base path when served through nginx at staging.bmbinc.com/dev
})
