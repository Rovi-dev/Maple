/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './views/**/*.ejs',      // scan EJS templates for Tailwind classes
    './public/**/*.html',    // scan any HTML files
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
