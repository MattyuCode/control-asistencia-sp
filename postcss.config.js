// PostCSS procesa los CSS. Para nuestro proyecto solo necesita Tailwind
// y autoprefixer (que añade prefijos -webkit- y demás automáticamente).
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
