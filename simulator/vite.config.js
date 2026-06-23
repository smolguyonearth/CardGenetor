import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3001,
    fs: {
      // Allow serving files from one level up to the project root
      allow: ['..'],
    },
  },
});
