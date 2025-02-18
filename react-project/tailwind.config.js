/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // 기존 색상 유지
        primary: '#4F46E5',
        secondary: '#0EA5E9',
        accent: '#F59E0B',
        background: '#F9FAFB',
        card: '#FFFFFF',
        textPrimary: '#1F2937',
        textSecondary: '#6B7280',

        // 🟢 자연 (Nature) 테마
        forestGreen: '#228B22',
        mossGreen: '#8A9A5B',
        pineGreen: '#01796F',
        oliveDrab: '#6B8E23',
        earthBrown: '#7C4A1D',
        deepWood: '#3E2723',

        // 🟠 석양 (Sunset) 테마
        sunsetOrange: '#FF4500',
        duskPurple: '#5D3A9B',
        warmRed: '#D72638',
        twilightBlue: '#2A2B4A',
        amberGlow: '#FFBF00',

        // 🔵 오션 (Ocean) 테마
        deepSea: '#003366',
        oceanBlue: '#0077B6',
        turquoise: '#40E0D0',
        aquaWave: '#00CED1',
        coralReef: '#FF7F50',

        // 🎨 파스텔 (Pastel) 테마
        pastelPink: '#FEC5E5',
        pastelBlue: '#AEEEEE',
        pastelLavender: '#D8BFD8',
        pastelYellow: '#FFFACD',
        pastelMint: '#98FB98',

        // 💡 네온 (Neon) 테마
        neonPink: '#FF10F0',
        neonYellow: '#FFFF33',
        neonOrange: '#FF6600',
        neonPurple: '#9400D3',
        neonGreen: '#39FF14',

        // 🖤 다크 (Dark) 테마
        charcoal: '#36454F',
        gunmetal: '#2C3539',
        nightSky: '#191970',
        obsidian: '#080808',
        darkSlate: '#2F4F4F',

        // ✅ 추가된 커피 계열 색상
        mochaBrown: '#6F4E37',
        coffeeBrown: '#5C4033',
        latteBeige: '#E6C7A6',
        espressoBlack: '#3B2F2F',
        caramelTan: '#C69C6D',
        warmBeige: '#F5E6CA',
        roastedCocoa: '#4B2E2F',
        hazelnutBrown: '#8B5A2B',

        // 🎨 Cobalt 계열
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
        oceanBlue: '#2A9D8F',
        seaFoam: '#5FC3E4',
        deepTeal: '#1E4D4F',

        //싱그러운 다이어트 느낌의 색상
        freshLime: '#A7E22E',
        minLeaf: '#6BCEBB',
        healthyGreen: '#2C9E4B',
        avocado: '#417D39',
        citrusYellow: '#F6D743',
        greenTea: '#BFEA7C',
      },
    },
  },
  plugins: [require('tailwind-scrollbar-hide')], // 스크롤바 숨기기 플러그인
}
