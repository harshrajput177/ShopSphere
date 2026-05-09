import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./Slices/ProductSlice";
import cartReducer from "./Slices/cartSlice";
import wishlistReducer from "./Slices/wishlistSlice";
import productTypeReducer from "./Slices/ProductType"
import auth from "./Slices/authSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
    products: productReducer,
    productType: productTypeReducer,
    auth: auth
  }
});