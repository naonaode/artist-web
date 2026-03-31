import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/wiki': {
        target: 'https://upload.wikimedia.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/wiki/, ''),
        secure: false,
      }
    }
  }
})

