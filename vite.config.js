import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: process.env.AI_IMAGE_GENERATOR || '/AI_Image_Generator/',
})