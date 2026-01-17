import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Remove basicSsl for now
export default defineConfig({
  plugins: [react()]
})