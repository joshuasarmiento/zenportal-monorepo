import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import Sitemap from 'vite-plugin-sitemap'

// https://vite.dev/config/
// Trigger restart for env vars
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    Sitemap({
      hostname: 'https://zenportal.com.ph',
    }),
  ],
  base: "/",
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
