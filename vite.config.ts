import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // 将体积较大的 recharts 拆分到独立 chunk
          recharts: ['recharts'],
        },
      },
    },
  },
})
