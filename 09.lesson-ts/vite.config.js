import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src") // map '@' to './src'
    },
  },
  test: {
    environment: 'happy-dom',
    globals: true,
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Адрес GraphQL сервера
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
