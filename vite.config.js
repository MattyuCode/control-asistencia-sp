// Configuración de Vite (el build tool)
// Esto le dice a Vite que use React y cómo generar el build final.
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Esta línea hace que el archivo HTML final se pueda abrir con doble clic
  // sin necesidad de un servidor web (rutas relativas)
  base: './',
  build: {
    outDir: 'dist',
    // Genera un solo archivo HTML con todo dentro (más fácil de distribuir)
    assetsInlineLimit: 100000000, // 100 MB - inline casi todo
  }
});
