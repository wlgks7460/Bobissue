/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
<<<<<<< HEAD
  plugins: [
    require('tailwind-scrollbar-hide'), // 스크롤바 숨김 플러그인 추가
  ],
=======
  plugins: [],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Tailwind가 적용될 파일 경로 지정
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4F46E5", // 보라 계열 (메인 포인트)
        secondary: "#0EA5E9", // 파란 계열 (보조 색상)
        accent: "#F59E0B", // 주황 계열 (강조)
        background: "#F9FAFB", // 연한 회색 (배경)
        card: "#FFFFFF", // 카드 배경
        textPrimary: "#1F2937", // 진한 글씨색
        textSecondary: "#6B7280", // 흐린 글씨색
      },
    },
  },
  plugins: [],
  theme: {
    extend: {
      colors: {
        brown: {
          50: "#f5f3f0",
          100: "#e7e0d9",
          200: "#cfc1b3",
          300: "#b29f8a",
          400: "#8c7358",
          500: "#725a3e", // 기본 브라운
          600: "#5a4630",
          700: "#443426",
          800: "#2f231b",
          900: "#1c140f",
        },
      },
    },
  },


>>>>>>> 6002e3143ed5c3343cb5a682b4add77df4e5af9d
}


