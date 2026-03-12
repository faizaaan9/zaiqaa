export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        z: {
          50:  '#f0faf4', 100: '#dcf3e5', 200: '#bbe6cc',
          300: '#89d1a8', 400: '#52b47e', 500: '#2d9660',
          600: '#1e7a4c', 700: '#19613d', 800: '#174d32',
          900: '#14402a', 950: '#0a2419',
        },
        gold: { 400: '#f9c842', 500: '#e8a800', 600: '#c98f00' }
      },
    },
  },
  plugins: [],
}
