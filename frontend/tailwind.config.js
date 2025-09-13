/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        discord: {
          blurple: '#5865F2',
          green: '#57F287',
          yellow: '#FEE75C',
          red: '#ED4245',
          dark: '#2C2F33',
          darker: '#23272A',
          darkest: '#1E2124',
        }
      },
      animation: {
        'shine': 'shine 2s infinite',
        'shimmer': 'shimmer 2s infinite linear',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'bounce-in': 'bounce-in 0.6s ease-out',
        'slide-in-left': 'slide-in-left 0.5s ease-out',
        'slide-in-right': 'slide-in-right 0.5s ease-out',
        'fade-in-up': 'fade-in-up 0.6s ease-out',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      keyframes: {
        shine: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200px 0' },
          '100%': { backgroundPosition: 'calc(200px + 100%) 0' }
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(59, 130, 246, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.8), 0 0 30px rgba(59, 130, 246, 0.6)' }
        },
        'bounce-in': {
          '0%': { opacity: '0', transform: 'scale(0.3)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        'slide-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(255, 215, 0, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(255, 215, 0, 0.6), 0 0 30px rgba(255, 215, 0, 0.4)' }
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}