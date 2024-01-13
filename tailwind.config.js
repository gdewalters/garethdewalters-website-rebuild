module.exports = {
  //content: ["**/*.njk"],
  content: [
    // './src/**/*.{html,js}',
      '**/*.njk',
      'node_modules/preline/dist/*.js',
  ],

  safelist: [],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        change: "transparent",
        current: 'currentColor',
        gdwGlamorganRed: '#E4383F',
        gdwAmber: '#FF7F11',
        gdwCafeNoir: '#4F3824',
        gdwEerieBlack: '#262626',
        gdwLemonChiffon: '#FAF0CA',
        gdwHighlightBlue: 'AED1F2',
      },
      fontFamily: {
        sans: ["Lato", "sans-serif"],
        serif: ["Merriweather", "serif"],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('preline/plugin'),
  ],
};