import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/attendance_calculator/',
  plugins: [react()],
})