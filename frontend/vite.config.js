// vite.config.js
// Vite configuration for ResQGrid frontend.
// Sets up:
//   - React plugin for JSX transform
//   - Dev server proxy: /api → http://localhost:4000 (avoids CORS during development)
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Proxy API calls to the Express backend in development.
    // In production, the reverse proxy (nginx/Cloud Run) handles this.
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
});
