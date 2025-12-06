import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  server: {
    host: true,
    port: 3000,
    watch: {
      usePolling: true,
    },
    // Allow all hosts in development
    allowedHosts: [
      'localhost',
      '.traefik.me',
      '.local',
    ],
  },
  preview: {
    host: true,
    port: 3000,
    // Allow all hosts in preview mode
    allowedHosts: [
      'localhost',
      '.traefik.me',
      '.local',
    ],
  },
})

