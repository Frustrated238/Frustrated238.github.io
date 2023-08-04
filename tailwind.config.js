/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  purge: [
    './src/**/*.html',
    './src/**/*.js',
  ],
  content: [],
  theme: {
    extend: {
      fontFamily: {
        // default: ['"Space Grotesk"', 'sans-serif'],
        'SpaceGrotesk': ['"Space Grotesk"', 'sans-serif'],
        'SpaceMono': ['"Space Mono"', 'serif'],
        'Inter': ['"Inter"', 'serif'],
      },
    },
    colors: {
      'light-sand': '#FCF7E6',
      'black': '#000',
      'white': '#FFF',
      'customBorder' : 'rgba(255, 255, 255, 0.50)'
    },
  },
  plugins: [],
}

