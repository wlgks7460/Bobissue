/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [
    require('tailwind-scrollbar-hide'), // 스크롤바 숨김 플러그인 추가
  ],
}
