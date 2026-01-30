import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/openai-replicate-client/",
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
  },
})
