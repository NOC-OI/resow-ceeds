/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/layouts/**/*.{js,ts,jsx,tsx,mdx}',
    './src/styles/**/*.{js,ts,jsx,tsx,mdx}',
    './App.tsx',
  ],
  theme: {
    extend: {
      boxShadow: {
        custom: '1px 4px 10px rgba(255, 255, 255, 0.2)',
      },
    },
  },
  plugins: [],
}
