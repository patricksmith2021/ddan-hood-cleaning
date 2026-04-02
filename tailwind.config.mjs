/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: '#FF5E15',
        'primary-dark': '#E54F0D',
        secondary: '#1A1A1A',
        'dark-base': '#111111',
        'body-text': '#D4D4D4',
        'body-text-light': '#333333',
        'muted-text': '#999999',
        'star-rating': '#FFB800',
        'border-subtle': '#333333',
      },
      fontFamily: {
        display: ["'Fira Sans Condensed'", 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
        body: ['Heebo', 'sans-serif'],
      },
      maxWidth: {
        content: '1200px',
      },
      lineHeight: {
        body: '1.7',
        heading: '1.3',
      },
    },
  },
  plugins: [],
};
