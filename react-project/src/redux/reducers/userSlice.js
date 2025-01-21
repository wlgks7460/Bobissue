import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState: {},
  reducers: {},
})

export const userReducerActions = userSlice.actions
export default userSlice.reducer
