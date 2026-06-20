import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss(),],
  resolve: {
    alias: {
      'zod': path.resolve(__dirname, './node_modules/zod')
    },
    tsconfigPaths: true,
  },
})
