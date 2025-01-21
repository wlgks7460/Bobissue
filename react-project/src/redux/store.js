import { configureStore } from '@reduxjs/toolkit'
import userReducer from './reducers/userSlice'

export default configureStore({
  reducer: {
    // user 관련 기능
    user: userReducer,
  },
})
