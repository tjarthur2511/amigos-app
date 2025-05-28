/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: 'class', // ✅ Enables class-based dark mode
  theme: {
    extend: {
      fontFamily: {
        comfortaa: ['Comfortaa', 'cursive'],
      },
      colors: {
        blush: '#FFF1F1',
        peach: '#FFEFE9',
        sky: '#4AB8FF',
        mint: '#A0E8AF',
        yellow: '#FFD93D',
        charcoal: '#2B2B2B',
        gray: '#666666',
        coral: '#FF6B6B',
        'coral-dark': '#e15555', // Added coral-dark
      },
      keyframes: {
        fall: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(120vh)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        fall: 'fall linear infinite',
        'spin-slow': 'spin 6s linear infinite',
        wiggle: 'wiggle 1.5s ease-in-out infinite',
        'fade-in': 'fadeIn 0.6s ease-out',
      },
    },
  },
  plugins: [],
};
