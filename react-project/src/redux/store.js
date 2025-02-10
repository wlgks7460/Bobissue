import { configureStore } from '@reduxjs/toolkit'
import userReducer from './reducers/userSlice'
import categoryReducer from './reducers/categorySlice'

export default configureStore({
  reducer: {
    // user 관련 기능
    user: userReducer,
    category: categoryReducer,
  },
})
