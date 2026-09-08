import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'node:path';

// No `withWhileUIViteCompat`: the DOM track has no React Native in it. If this
// ever needs it, something has imported across the tracks.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@thewhileloop/whileui/web': resolve(__dirname, '../../packages/ui/src/web'),
    },
  },
  server: { port: 8083 },
});
