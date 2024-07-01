/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/*.{html,js,ejs}",
    "./views/User/*.{html,js,ejs}",
    "./views/Admin/*.{html,js,ejs}",
    'node_modules/preline/dist/*.js',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('preline/plugin'),
  ],
}

