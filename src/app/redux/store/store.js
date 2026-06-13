import { configureStore } from '@reduxjs/toolkit'
import cartSliceReducer from '../slice/cartSlice'
import addressSliceReducer from '../slice/addressSlice'

export const store = configureStore({
    reducer: {
        cart: cartSliceReducer,
        address:addressSliceReducer
    },
});