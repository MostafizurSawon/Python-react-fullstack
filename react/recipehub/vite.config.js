// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: '_redirects', // Path to the _redirects file in your project root
          dest: '.', // Copy to the root of the dist/ folder
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      'react-bootstrap-icons': 'react-bootstrap-icons', // Ensure this resolves correctly
    },
  },
  base: '/', // Ensure asset paths are correct for Netlify (root deployment)
  build: {
    outDir: 'dist', // Explicitly set the output directory (default is 'dist')
  },
});