/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: ["./src/**/*.html", "./src/**/*.js"],
  theme: {
    fontFamily: {
      // default: ['"Space Grotesk"', 'sans-serif'],
      SpaceGrotesk: ['"Space Grotesk"', "sans-serif"],
      SpaceMono: ['"Space Mono"', "sans-serif"],
      Inter: ['"Inter"', "serif"],
    },
    extend: {
      gridTemplateColumns: {
        layout: "repeat(auto-fit, minmax(300px, 1fr))",
      },
    },
    colors: {
      "light-sand": "#FCF7E6",
      black: "#000",
      white: "#FFF",
      customBorder: "rgba(255, 255, 255, 0.50)",
    },
  },
  plugins: [],
};
