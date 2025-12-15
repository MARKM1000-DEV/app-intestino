/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    // Esta é a linha que corrige o erro que você está vendo:
    '@tailwindcss/postcss': {}, 
  },
};

export default config;