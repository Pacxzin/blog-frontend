import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Permite importar com @/ ao invés de ../../
      // Ex: import Button from '@/components/Button'
      '@': path.resolve(__dirname, './src'),
    },
  },
})