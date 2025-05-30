import axios from 'axios'
import store from '../redux/store'
import { userReducerActions } from '../redux/reducers/userSlice'
import { loadingReducerActions } from '../redux/reducers/loadingSlice'

const API = axios.create({
  // baseURL: '/api',
  baseURL: `${import.meta.env.VITE_BOBISUUE_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 요청 interceptors: 요청에 jwt 추가
API.interceptors.request.use((config) => {
  const { accessToken, refreshToken } = store.getState().user
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
    config.headers['refreshToken'] = `Bearer ${refreshToken}`
  }

  return config
})

// 응답 interceptors: 토큰 갱신
API.interceptors.response.use(
  (res) => {
    // access_token 갱신
    const newAccessToken = res.headers['newaccesstoken']
    if (newAccessToken) {
      store.dispatch(
        userReducerActions.login({
          access_token: newAccessToken,
          refresh_token: store.getState().user.refreshToken,
          status: store.getState().user.status,
        }),
      )
      console.log('토큰 갱신됨')
    }
    return res
  },
  (err) => {
    console.error(err)
    // 로그인이 되어있을 경우에만
    if (store.getState().user.isAuthenticated) {
      // refreshToken이 만료되었다면 로그아웃
      if (err.response) {
        const { data, status } = err.response
        const loginStatus = store.getState().user.status
        if (status === 401) {
          console.warn('인증 실패:', err)
          store.dispatch(userReducerActions.logout())
          alert('인증이 만료되었습니다.')
          if (loginStatus === 'seller') {
            window.location.href = '/seller'
          } else if (loginStatus === 'admin') {
            window.location.href = '/admin'
          } else if (loginStatus === 'consumer') {
            window.location.href = '/login'
          }
        }
      }
      return Promise.reject(err)
    }
  },
)

export default API
