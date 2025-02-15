import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    // 웹소켓 관련 추가 코드
    define: {
      global: 'window', // ✅ global 변수를 window로 설정
    },
    optimizeDeps: {
      exclude: ['@stomp/stompjs'], // ✅ 번들링에서 제외하여 직접 사용하도록 설정
    },
    server: {
      // proxy: {
      //   '/api': {
      //     target: env.VITE_BOBISUUE_BASE_URL,
      //     changeOrigin: true,
      //   },
      // },
      allowedHosts: [
        'bobissue.store', // 허용할 호스트 추가
        'www.bobissue.store', // 다른 호스트도 필요하다면 추가
      ],
      hmr: {
        host: 'bobissue.store',  // WebSocket 연결 호스트 설정
        protocol: 'wss',  // HTTPS 환경이면 wss로 설정
      }
    },
  }
})
