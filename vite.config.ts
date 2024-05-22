import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: 'src/main.ts',
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`,
      },
    },
    assetsDir: '', // Ensure that assets are in the root of the dist directory
    sourcemap: false,
    manifest: false,
    chunkSizeWarningLimit: 500,
  },
  publicDir: 'public', // Ensure Vite uses the public directory
  esbuild: {
    minify: false,
    // Ensures no versioned filenames
    minifyIdentifiers: false,
    minifyWhitespace: false,
    minifySyntax: false,
  },
})
