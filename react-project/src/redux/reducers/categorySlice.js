import { createSlice } from '@reduxjs/toolkit'
import { Children } from 'react'

export const categorySlice = createSlice({
  name: 'category',
  initialState: {
    categories: {},
  },
  reducers: {
    setCategory: (state, action) => {
      state.categories = action.payload.categories.map((v) => {
        const data = {
          categoryNo: v.categoryNo,
          name: v.name,
          children: v.children.map((c) => {
            const childData = {
              categoryNo: c.categoryNo,
              name: c.name,
            }
            return childData
          }),
        }
        return data
      })
    },
  },
})

export const categoryReducerActions = categorySlice.actions
export default categorySlice.reducer
