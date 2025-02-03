import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    accessToken: localStorage.getItem('access_token') || null, // jwt access_token
    refreshToken: localStorage.getItem('refresh_token') || null, // jwt refresh_token
    isAuthenticated: !!localStorage.getItem('access_token'), // 로그인 상태
  },
  reducers: {
    /** 로그인 */
    login: (state, action) => {
      state.accessToken = action.payload.access_token
      state.refreshToken = action.payload.refresh_token
      state.isAuthenticated = true
      localStorage.setItem('access_token', action.payload.access_token)
      localStorage.setItem('refresh_token', action.payload.refresh_token)
    },
    /** 로그아웃 */
    logout: (state, action) => {
      state.accessToken = null
      state.refreshToken = null
      state.isAuthenticated = false
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
    },
  },
})

export const userReducerActions = userSlice.actions
export default userSlice.reducer
