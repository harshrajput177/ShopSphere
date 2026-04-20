import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 🔥 FETCH ONLY ONCE
export const fetchHomeProducts = createAsyncThunk(
  "products/fetchHomeProducts",
  async (_, { getState }) => {
    const state = getState();

    // 🔥 CACHE CHECK
    if (state.products.items.length > 0) {
      return state.products.items; // already cached
    }

    const res = await axios.get(
      "http://localhost:4000/api/products/home"
    );

    return res.data;
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    items: {},
    loading: false
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomeProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchHomeProducts.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      });
  }
});

export default productSlice.reducer;