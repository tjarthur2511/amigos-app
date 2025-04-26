// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: [
      '@firebase/util',
      '@firebase/component',
      '@firebase/logger',
      '@firebase/auth',
      '@firebase/firestore',
      '@firebase/app',
      '@firebase/webchannel-wrapper',
    ],
  },
});
