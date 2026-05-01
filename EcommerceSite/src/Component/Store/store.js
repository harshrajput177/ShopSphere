import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./Slices/ProductSlice";
import auth from "./Slices/authSlice";

export const store = configureStore({
  reducer: {
    products: productReducer,
    auth: auth
  }
});