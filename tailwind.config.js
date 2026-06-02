/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './views/**/*.ejs',      // scan all EJS templates including pages and partials
    './public/**/*.html',    // scan any HTML files
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
