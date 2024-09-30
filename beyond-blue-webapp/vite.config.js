import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      // Proxy all requests that start with `/send-email` to the backend
      '^/send-email': {
        target: 'http://localhost:3000', // Your backend API URL
        changeOrigin: true,
        secure: false, // If you're using https on the backend, set this to true
      },
    },
  },
});
