/** @type {import('tailwindcss').Config} */
module.exports = {
  // content: ["./views/*.ejs"],
  content: ["./views/**/*.ejs"],
  theme: {
    extend: {},
  },
  plugins: [
    {
      tailwindcss: {},
      autoprefixer: {},
    },
  ],
};
