// eslint-disable-next-line @typescript-eslint/no-var-requires
const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/tw-elements/dist/js/**/*.js',
  ],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
    fontFamily: {
      sans: ['Merriweather', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
    },
    extend: {
      colors: {
        // primary: {
        //   100: '#e8f0f9',
        //   200: '#bbd3ee',
        //   300: '#8db6e3',
        //   400: '#337ccc',
        //   500: '#3178c6',
        //   600: '#27609f',
        //   700: '#1c4572',
        //   800: '#112944',
        //   900: '#060e17',
        // },
        primary: colors.gray,
      },
      spacing: {
        128: '32rem',
        144: '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};
