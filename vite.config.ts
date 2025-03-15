import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: 'dist',
    assetsDir: 'assets', // Ensure correct asset handling
  },
  server: {
    port: 3000,
  },
})
