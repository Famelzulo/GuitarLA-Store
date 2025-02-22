import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: "/GuitarLA-Store/",  // 👈 Agrega esta línea
  plugins: [react()],
})
