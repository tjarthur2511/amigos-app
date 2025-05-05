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
    },
  },
  plugins: [],
};
