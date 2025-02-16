/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Tailwind가 적용될 파일 경로 지정
  ],
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
  plugins: [],
  theme: {
    extend: {
      colors: {
        brown: {
          50: '#f5f3f0',
          100: '#e7e0d9',
          200: '#cfc1b3',
          300: '#b29f8a',
          400: '#8c7358',
          500: '#725a3e', // 기본 브라운
          600: '#5a4630',
          700: '#443426',
          800: '#2f231b',
          900: '#1c140f',
        },
        coffee: {
          50: '#f5e9dc',
          100: '#ebd6c5',
          200: '#d4b69e',
          300: '#b99177',
          400: '#9f7055',
          500: '#80553d',
          600: '#66402c',
          700: '#4d2d1d',
          800: '#371d12',
          900: '#24110b',
        },
        caramel: {
          50: '#fdf3e6',
          100: '#fae0bf',
          200: '#f5c78f',
          300: '#eb9f4f',
          400: '#d68232',
          500: '#b56428',
          600: '#924c22',
          700: '#71371c',
          800: '#502314',
          900: '#36150d',
        },
        mocha: {
          50: '#efe6e1',
          100: '#dfcfc4',
          200: '#c0a796',
          300: '#a0836c',
          400: '#84654e',
          500: '#6a4d3a',
          600: '#533b2b',
          700: '#3f2b1f',
          800: '#2c1c15',
          900: '#1c110e',
        },
      },
    },
  },
}
