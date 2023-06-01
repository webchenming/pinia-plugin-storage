import { defineConfig } from 'vite'

import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: './',
  server: {
    host: true,
    port: 3001,
  },
  plugins: [vue()],
})
