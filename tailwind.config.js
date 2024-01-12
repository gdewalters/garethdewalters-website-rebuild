module.exports = {
    content: ["**/*.njk"],
    safelist: [],
    darkMode: "class",
    theme: {
      extend: {
        colors: {
          change: "transparent",
        },
        fontFamily: {
          lato: ["Lato", "sans-serif"],
          merriweather: ["Merriweather", "sans"],
        },
      },
    },
    plugins: [
      require('@tailwindcss/typography'),
    ],
  };
