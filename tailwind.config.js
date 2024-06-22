/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#101624',
          foreground: '#202a3f',
          text: '#626d84'
        },
        secondary: {
          DEFAULT: '#1a2235',
          text: '#9ca7bc'
        }
      }
    }
  },
  plugins: []
}
