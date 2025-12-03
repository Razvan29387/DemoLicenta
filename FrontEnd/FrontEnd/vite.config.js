import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/persons': 'http://localhost:8080',
      '/firme': 'http://localhost:8080',
    }
  }
})