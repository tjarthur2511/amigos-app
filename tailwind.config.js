/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Comfortaa', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
        comfortaa: ['Comfortaa', 'cursive'],
      },
      colors: {
        blush: '#FFF1F1',
        peach: '#FFEFE9',
        sky: '#4AB8FF',
        mint: '#A0E8AF',
        charcoal: '#2B2B2B',
        coral: '#FF6B6B',
        'coral-dark': '#e15555',
        accent: {
          DEFAULT: '#FFC107',
          secondary: '#4FC3F7',
        },
        neutral: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#EEEEEE',
          300: '#E0E0E0',
          400: '#BDBDBD',
          500: '#9E9E9E',
          600: '#757575',
          700: '#616161',
          800: '#424242',
          900: '#212121',
        },
        feedback: {
          success: '#4CAF50',
          'success-bg': '#E8F5E9',
          error: '#F44336',
          'error-bg': '#FFEBEE',
          warning: '#FF9800',
          'warning-bg': '#FFF3E0',
          info: '#2196F3',
          'info-bg': '#E3F2FD',
        },
      },
      spacing: {
        'container-px': '1rem',
        'container-py': '2rem',
        'card-p': '1.5rem',
        'modal-p': '2rem',
      },
      borderRadius: {
        sm: '0.25rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.5rem',
        button: '30px',
        input: '0.5em',
      },
      keyframes: {
        fall: {
          '0%': { transform: 'translateY(-10vh)' },
          '100%': { transform: 'translateY(110vh)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
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
