/** @type {import('tailwindcss').Config} */
//'#4100FD' purple
module.exports = {
  content: ["./index.html", "./src/**/*.{html,js,ts,tsx}"],
  theme: {
    colors: {
    "blue" : '#1fb6ff',
    'gray-light': '#EBEBEB',
    'gray': '#BBBBBB',
    "red": "#E02626",
    "purple": '#4361EE',
    "purple-light": "#EEE9FE",
    "purple-dark": "#220085",
    "pink": '#ff49db',
    "orange": '#ff7849',
    "white": "#FFF",
    "aqua": "#17BEBB",
    "black": "#343F3E",
    'green': '#67E11C',
    'green-dark': '#357310',
    'yellow': '#ffc82c',
    'gray-dark': '#273444',
  },
    extend: {
      fontSize:
      {
        '4xl': '1.7rem'
      }
    },
  },
  plugins: [],
}
