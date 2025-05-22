import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: './vitest.setup.js', // Optional: if you need global setup
    coverage: { // Optional: if you want coverage reports
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
  resolve: {
    alias: {
      '@': '/src', // Assuming your aliases are set up like this
    },
  },
});
