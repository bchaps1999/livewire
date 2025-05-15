import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy API requests to the Cloudflare Functions dev server
      '/api': {
        target: 'http://localhost:8788', // Default port for `wrangler pages dev`
        changeOrigin: true,
        // No rewrite needed if wrangler serves functions under the /api path
        // e.g., a request to /api/top-stories will be proxied to http://localhost:8788/api/top-stories
      },
      // Proxy auth function requests
      '/login': {
        target: 'http://localhost:8788',
        changeOrigin: true,
      },
      '/logout': {
        target: 'http://localhost:8788',
        changeOrigin: true,
      },
      // Proxy for the auth callback if it's also a function path
      '/auth/callback': {
        target: 'http://localhost:8788',
        changeOrigin: true,
      }
    },
  },
})
