/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
<<<<<<< HEAD
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
};
=======
        // 기존 색상
        primary: '#4F46E5',
        secondary: '#0EA5E9',
        accent: '#F59E0B',
        background: '#F9FAFB',
        card: '#FFFFFF',
        textPrimary: '#1F2937',
        textSecondary: '#6B7280',
        silverLight: '#F8F9FA',
        silverMedium: '#D1D5DB',
        silverDark: '#A0A4A8',
        accentSilver: '#73787D',
        buttonSilver: '#B0B4B8',
        buttonHover: '#8A8E92',
        iceBlue: '#D6E6F2',
        steelGray: '#62757F',
        deepNavy: '#1B2A41',
        neonBlue: '#009FFD',
        coolCyan: '#0A9396',
        darkGraphite: '#2D3436',
        frostWhite: '#E3E6E8',
        frozenSilver: '#BCC5D3',
        steelBlue: '#7A9E9F',
        deepCobalt: '#2D4F6F',
        neonAqua: '#00C8FF',
        graphiteBlack: '#1E252B',
        frostyCyan: '#0A95A6',
        darkChrome: '#5A5F63',
        richGold: '#D4AF37',
        darkEmerald: '#006D5B',
        moneyGreen: '#4CAF50',
        luxuryNavy: '#1F3B4D',
        graphiteBlack: '#1E252B',
        platinumSilver: '#C0C0C0',
        darkChrome: '#5A5F63',
        neonMint: '#00FFAF',

        // ✅ 추가된 커피 계열 색상
        mochaBrown: '#6F4E37', // 따뜻한 모카 브라운 (메인 버튼, 배경)
        coffeeBrown: '#5C4033', // 진한 커피색 (호버 효과)
        latteBeige: '#E6C7A6', // 부드러운 라떼 베이지 (서브 메뉴 배경)
        espressoBlack: '#3B2F2F', // 에스프레소 블랙 (진한 브라운 폰트)
        caramelTan: '#C69C6D', // 카라멜 톤 (강조 색상)
        warmBeige: '#F5E6CA', // 밝고 따뜻한 베이지 (배경)
        roastedCocoa: '#4B2E2F', // 다크 초콜릿 색상 (포인트)
        hazelnutBrown: '#8B5A2B', // 고급스러운 헤이즐넛 브라운 (UI 요소)

        cobalt: {
          50: '#eef2ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
    },
  },
  plugins: [require('tailwind-scrollbar-hide')], // 스크롤바 숨기기 플러그인
}
>>>>>>> bb72d2ef95f9d368c0da53dd599107f0431d2d93
