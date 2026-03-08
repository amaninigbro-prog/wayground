/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef4ff',
          100: '#d9e7ff',
          200: '#bcd4ff',
          300: '#8fb8ff',
          400: '#5a91ff',
          500: '#2f6bff',
          600: '#1e54f0',
          700: '#1b46dc',
          800: '#1e3cb2',
          900: '#1f378c'
        },
        accent: {
          500: '#7c3aed'
        },
        success: {
          500: '#10b981'
        }
      },
      boxShadow: {
        soft: '0 10px 30px rgba(15, 23, 42, 0.08)',
        glow: '0 20px 60px rgba(47, 107, 255, 0.20)'
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        fadeUp: 'fadeUp 0.7s ease forwards',
        pulseSoft: 'pulseSoft 2.5s ease-in-out infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' }
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        pulseSoft: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.03)', opacity: '0.92' }
        }
      }
    },
  },
  plugins: [],
}
