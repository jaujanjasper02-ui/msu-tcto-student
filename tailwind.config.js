/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        trac: {
          primary: "#1B5E20",
          primaryDark: "#0D3B10",
          primaryLight: "#2E7D32",
          primaryLighter: "#388E3C",
          secondary: "#F9A825",
          secondaryDark: "#F57F17",
          secondaryLight: "#FBC02D",
          accent: "#33691E",
          background: "#F1F8E9",
        },
        // Legacy aliases for gradual migration
        msu: {
          maroon: "#1B5E20",
          blue: "#2E7D32",
        }
      },
      fontFamily: {
        serif: ['Times New Roman', 'serif'],
      }
    },
  },
  plugins: [],
};
