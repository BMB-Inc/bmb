import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react/dist/index.js'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
