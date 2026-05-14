import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    // Exclude firebase since it's been removed
    exclude: ['firebase', 'firebase/auth', 'firebase/analytics'],
  },
  css: {
    preprocessorOptions: {},
  },
})
