import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // Tell Vite to also treat .JPG (uppercase) as a static asset
  assetsInclude: ['**/*.JPG'],
})
