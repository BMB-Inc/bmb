import { defineConfig } from 'vite'
// Import the React plugin correctly in JavaScript format
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
  plugins: [react(), basicSsl()],
  server: {
    port: 5173,
    open: true
  }
})
