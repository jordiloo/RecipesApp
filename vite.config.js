import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'https://recipes-app-9d6n-i95ckmxtk-jordiloos-projects.vercel.app/'
    }
  }
})