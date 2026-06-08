import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Set GITHUB_PAGES=true when deploying to https://<user>.github.io/<repo>/
const base = process.env.GITHUB_PAGES === 'true' ? '/biolink/' : '/';

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
});
