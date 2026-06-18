import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Set GITHUB_PAGES=true when deploying to https://<user>.github.io/<repo>/
// O caminho precisa bater com o nome do repositório (case-sensitive): /BioLink/.
const base = process.env.GITHUB_PAGES === 'true' ? '/BioLink/' : '/';

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
});
