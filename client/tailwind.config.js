/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkblue: '#05001c', // Add your custom color here
      },
    },
  },
  darkMode: 'class', // Enable class-based dark mode
   
}
