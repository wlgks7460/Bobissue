import axios from 'axios'
import store from '../redux/store'
import { userReducerActions } from '../redux/reducers/userSlice'

const API = axios.create({
  // baseURL: '/api',
  baseURL: import.meta.env.VITE_BOBISUUE_BASE_URL,
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
        }),
      )
      console.log('토큰 갱신됨')
    }
    return res
  },
  (err) => {
    // refreshToken이 만료되었다면 로그아웃
    if (err.response) {
      const { status, data } = err.response
      if (status === 401 || status === 403) {
        console.warn('인증 실패: 로그아웃')
        store.dispatch(userReducerActions.logout())
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  },
)

export default API
