/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: 'class', // ✅ Enables class-based dark mode
  theme: {
    extend: {
      fontFamily: {
        // Set Comfortaa as the default sans-serif font
        sans: ['Comfortaa', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
        comfortaa: ['Comfortaa', 'cursive'], // Keep specific utility if needed
      },
      colors: {
        // Existing colors
        blush: '#FFF1F1',
        peach: '#FFEFE9',
        sky: '#4AB8FF',
        mint: '#A0E8AF',
        // yellow: '#FFD93D', // Consider renaming or ensuring it fits the new palette
        charcoal: '#2B2B2B',
        // gray: '#666666', // Will be replaced by the neutral palette

        // Primary Theme Colors
        coral: '#FF6B6B',
        'coral-dark': '#e15555',
        
        // Accent Colors
        accent: {
          DEFAULT: '#FFC107', // Amber/Yellow - good for highlights, stars, etc.
          secondary: '#4FC3F7', // Light Blue - could be an alternative accent
        },

        // Neutral Color Palette (Grays)
        neutral: {
          50: '#FAFAFA',  // Very light gray (bg)
          100: '#F5F5F5', // Light gray (bg, borders)
          200: '#EEEEEE', // Light gray (borders, disabled elements)
          300: '#E0E0E0', // Gray (borders)
          400: '#BDBDBD', // Gray (icons, subtle text)
          500: '#9E9E9E', // Medium gray (text)
          600: '#757575', // Dark gray (text)
          700: '#616161', // Darker gray (headings)
          800: '#424242', // Very dark gray (strong text)
          900: '#212121', // Near black (charcoal alternative)
        },

        // Feedback Colors
        feedback: {
          success: '#4CAF50', // Green
          'success-bg': '#E8F5E9',
          error: '#F44336',   // Red
          'error-bg': '#FFEBEE',
          warning: '#FF9800', // Orange
          'warning-bg': '#FFF3E0',
          info: '#2196F3',    // Blue
          'info-bg': '#E3F2FD',
        },
      },
      spacing: {
        // Standardized spacing units (can be extended)
        // Tailwind already has a good default spacing scale (0, 0.5, 1, 1.5, 2, ...)
        // Add specific named spacings if needed for larger layout sections
        'container-px': '1rem', // Default horizontal padding for containers
        'container-py': '2rem', // Default vertical padding for containers
        'card-p': '1.5rem',     // Default padding for cards (matches existing rounded-[1.5rem])
        'modal-p': '2rem',      // Default padding for modals
      },
      borderRadius: {
        // Standardized border radius options
        // Tailwind defaults: none, sm, md, lg, xl, 2xl, 3xl, full
        // 'DEFAULT': '0.25rem', // Default if not specified (Tailwind's is 'rounded')
        'sm': '0.25rem',      // Small
        'md': '0.5rem',       // Medium (e.g., inputs, smaller buttons)
        'lg': '0.75rem',      // Large (e.g., cards, larger buttons)
        'xl': '1rem',         // Extra Large (e.g., modals)
        '2xl': '1.5rem',      // Matches current card rounding `rounded-[1.5rem]`
        'button': '30px',     // Specific for pill-shaped buttons (as per PROJECT_STRUCTURE.md)
        'input': '0.5em',     // Specific for inputs (as per PROJECT_STRUCTURE.md)
      },
      keyframes: {
        fall: {
          '0%': { transform: 'translateY(-10vh)' }, // Start off-screen
          '100%': { transform: 'translateY(110vh)' }, // End off-screen
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
