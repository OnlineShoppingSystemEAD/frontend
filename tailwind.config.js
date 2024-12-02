/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5B67B6',
        dark: '#121212',
      },
      borderRadius: {
        'xl': '23px',
        'full': '50%',
      },
      animation: {
        fadeUp: 'fadeUp 2s ease-in-out forwards',
        slideRight: 'slideRight 3s ease-in-out forwards',
        zoomIn: 'zoomIn 4s ease-in-out forwards',
        zoomInButton: 'zoomInButton 4s ease-in-out 2s',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        slideRight: {
          '0%': { opacity: 0, transform: 'translateX(50%)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
        zoomIn: {
          '0%': { opacity: 0, transform: 'scale(0.8)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        zoomInButton: {
          '0%': { opacity: 0, transform: 'scale(0.8)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
