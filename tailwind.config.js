/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        'below-500': {'max': '500px'}, // Custom breakpoint for screens less than 500px
      },
    },
  },
  plugins: [],
};
