/** @type {import('tailwindcss').Config} */

// Configuración de Tailwind CSS
// Aquí definimos los colores personalizados y las fuentes que usamos.
// Cualquier cambio aquí afecta a TODAS las clases de Tailwind del proyecto.

export default {
  // Le decimos a Tailwind qué archivos revisar para encontrar clases utilizadas
  content: [
    './index.html',
    './src/**/*.{js,jsx}'
  ],
  theme: {
    extend: {
      // Colores personalizados - usalos como bg-paper, text-ink, border-accent, etc.
      colors: {
        ink: '#0e1a2b',           // azul oscuro principal (textos)
        'ink-soft': '#2a3a52',    // azul medio (textos secundarios)
        paper: '#f4efe6',         // beige claro (fondo)
        'paper-warm': '#ebe3d3',  // beige más cálido (paneles)
        accent: '#c8451f',        // naranja-rojo (botones primarios)
        'accent-deep': '#9a2f12', // naranja oscuro (hover)
        gold: '#c8932a',          // dorado (acentos)
        leaf: '#4d7c3a',          // verde (positivos)
        muted: '#8a7d6a',         // gris (texto deshabilitado)

        // Estados de asistencia
        'st-medio': '#2a6f6a',
        'st-medio-extra': '#1a8c6a',
        'st-completo': '#c8932a',
        'st-falta': '#c8451f',
        'st-vacaciones': '#4d7c3a',
        'st-permiso': '#7a5fa6',
        'st-enfermedad': '#b85461',
        'st-feriado': '#5a6b85',
        'st-feriado-trab': '#8b5a9c',
      },
      // Fuentes personalizadas
      fontFamily: {
        serif: ['Fraunces', 'serif'],
        sans: ['Manrope', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      // Sombras estilo "neobrutalismo" (sombras planas con desplazamiento)
      boxShadow: {
        'brutal': '6px 6px 0 #0e1a2b',
        'brutal-accent': '6px 6px 0 #c8451f',
        'brutal-leaf': '6px 6px 0 #4d7c3a',
        'brutal-lg': '8px 8px 0 #0e1a2b',
      },
    },
  },
  plugins: [],
};
