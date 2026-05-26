import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./Slices/ProductSlice";
import cartReducer from "./Slices/cartSlice";
import wishlistReducer from "./Slices/wishlistSlice";
import productTypeReducer from "./Slices/ProductType"
import ratingReducer from "./Slices/RatingSlice"
import orderReducer from "./Slices/OrderSlice";
import addressReducer from "./Slices/addressSlice";
import auth from "./Slices/authSlice";
import couponReducer from "./Slices/CouponSlice";


export const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
    products: productReducer,
    productType: productTypeReducer,
    auth: auth,
    rating: ratingReducer,
    order: orderReducer,
    address: addressReducer,
     coupon: couponReducer,
  }
});