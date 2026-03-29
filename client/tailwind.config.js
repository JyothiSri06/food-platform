/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
        colors: {
            // Defined parchment as 'base' and slate as 'primary'
            parchment: {
                DEFAULT: '#E8E2D8',
                50: '#F5F2EC',
                100: '#EBE6DC',
                200: '#E1DACD',
                300: '#D7CEBE',
                400: '#CDC2AF',
            },
            slate: {
                DEFAULT: '#213C51',
                50: '#E8E2D8',
                100: '#E2D8C8',
                200: '#D5C9B0',
                300: '#C8BA98',
                400: '#BBAA80',
                500: '#213C51', 
                600: '#213C51', 
                700: '#1B3143',
                800: '#152635',
                900: '#0F1B27',
                950: '#091019',
            },
            // Legacy mapping for ease of transition
            orange: {
                50: '#E8E2D8',
                100: '#E2D8C8',
                200: '#D5C9B0',
                300: '#C8BA98',
                400: '#BBAA80',
                500: '#213C51', 
                600: '#213C51', 
                700: '#1B3143',
                800: '#152635',
                900: '#0F1B27',
                950: '#091019',
            },
            gray: {
                50: '#F5F2EC',
                100: '#EBE6DC',
                200: '#E1DACD',
                300: '#D7CEBE',
                400: '#CDC2AF',
                500: '#A39D80',
                600: '#7A755D',
                700: '#524E3E',
                800: '#29271F',
                900: '#14130F',
                950: '#0A0907',
            }
        }
    },
  },
  plugins: [],
}
