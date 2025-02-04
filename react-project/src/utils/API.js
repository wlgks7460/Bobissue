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
  const access_token = store.getState().user.accessToken
  const refresh_token = store.getState().user.refreshToken
  if (access_token) {
    console.log('토큰 있음', access_token)
    config.headers.Authorization = `Bearer ${access_token}`
    config.headers['refreshToken'] = `Bearer ${refresh_token}`
  }

  return config
})

// 응답 interceptors: 토큰 갱신
API.interceptors.response.use((res) => {
  // access_token 갱신
  console.log(res)
  const newAccessToken = res.headers.get('newAccessToken')
  console.log(newAccessToken)
  if (res.headers['authorization']) {
    const newAccessToken = res.headers['authorization']
    store.dispatch(
      userReducerActions.login({
        access_token: newAccessToken,
        refresh_token: store.getState().user.refreshToken,
      }),
    )
    console.log('토큰 갱신됨:', newAccessToken)
  }
  return res
})

export default API
