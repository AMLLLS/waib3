/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        aeonik: ['var(--font-aeonik)'],
        display: ['var(--font-space)'],
        poppins: ['var(--font-poppins)'],
      },
      colors: {
        'dark': {
          DEFAULT: '#0D0D0F',
          light: '#121214',
          lighter: '#18181B'
        },
        'primary': {
          DEFAULT: '#D1F34A',
          dark: '#B8D943',
          light: '#E5F580',
          50: '#F7FBDD',
          100: '#EFF8BB',
          200: '#E5F580',
          300: '#D1F34A',
          400: '#B8D943',
          500: '#9FC03C'
        },
        'light': '#F6F6F6',
        'gray': {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#B4B4B4',
          500: '#A3A3A3',
          600: '#666666',
          700: '#404040',
          800: '#262626',
          900: '#171717'
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(to right, var(--tw-gradient-stops))',
      },
      animation: {
        'gradient': 'gradient 8s linear infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
      },
    },
  },
  plugins: [],
} 