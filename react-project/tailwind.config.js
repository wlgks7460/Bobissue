/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#4F46E5', // 보라 계열 (메인 포인트)
        secondary: '#0EA5E9', // 파란 계열 (보조 색상)
        accent: '#F59E0B', // 주황 계열 (강조)
        background: '#F9FAFB', // 연한 회색 (배경)
        card: '#FFFFFF', // 카드 배경
        textPrimary: '#1F2937', // 진한 글씨색
        textSecondary: '#6B7280', // 흐린 글씨색
      },
    },
  },
  plugins: [require('tailwind-scrollbar-hide')], // 🧩 스크롤바 숨기기 플러그인 추가
};
