import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  // Относительные пути: сборка работает и в корне домена, и в подпапке GitHub Pages.
  base: './',
  plugins: [react()],
})
