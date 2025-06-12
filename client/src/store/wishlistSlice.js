import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
}

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const exists = state.items.find(item => item._id === action.payload._id)
      if (!exists) {
        state.items.push(action.payload)
      }
    },
    removeItem: (state, action) => {
      state.items = state.items.filter(item => item._id !== action.payload)
    },
    clearWishlist: (state) => {
      state.items = []
    }
  }
})

export const { addItem, removeItem, clearWishlist } = wishlistSlice.actions
export default wishlistSlice.reducer
