/** tailwind.config.js */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        comfortaa: ['Comfortaa', 'cursive'],
      },
      colors: {
        theme: {
          DEFAULT: "rgb(var(--theme-color) / <alpha-value>)",
          text: "rgb(var(--text-color) / <alpha-value>)",
          hover: "rgb(var(--hover-color) / <alpha-value>)",
        },
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
      },
      animation: {
        fall: 'fall linear infinite',
        'spin-slow': 'spin 6s linear infinite',
        wiggle: 'wiggle 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
