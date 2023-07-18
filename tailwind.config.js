/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/pages/**/*.{js,ts,jsx,tsx,mdx}', './src/components/**/*.{js,ts,jsx,tsx,mdx}', './src/app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      backgroundImage: {
        landing_bg: "url('../../public/landing_bg.png')",
      },
      fontFamily: {
        sans: ['var(--font-noto-sans-tc)'],
      },
      colors: {
        moonlight: {
          50: '#f6f8f9',
          100: '#e6ebef',
          200: '#d4dde3',
          300: '#aec1cb',
          400: '#829fae',
          500: '#628395',
          600: '#4d6a7c',
          700: '#405564',
          800: '#374955',
          900: '#323f48',
          950: '#212930',
        },
        sunrise: {
          50: '#fff6ed',
          100: '#ffecd4',
          200: '#ffd4a8',
          300: '#ffb570',
          400: '#ff8b37',
          500: '#ff690e',
          600: '#f04e06',
          700: '#c73907',
          800: '#9e2d0e',
          900: '#7f280f',
          950: '#451105',
        },
      },
    },
  },
  plugins: [],
};
