import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Standard output directory
  },
  publicDir: 'public', // Ensure files in public/ are copied to dist/
})
