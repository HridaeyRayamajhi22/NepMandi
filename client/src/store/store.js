import { configureStore, combineReducers } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import productReducer from './productSlice'
import cartReducer from './cartProduct'
import addressReducer from './addressSlice'
import orderReducer from './orderSlice'
import wishlistReducer from './wishlistSlice'

// redux-persist setup
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['wishlist'] // only wishlist will be persisted
}

const rootReducer = combineReducers({
  user: userReducer,
  product: productReducer,
  cartItem: cartReducer,
  addresses: addressReducer,
  orders: orderReducer,
  wishlist: wishlistReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
})

export const persistor = persistStore(store)
