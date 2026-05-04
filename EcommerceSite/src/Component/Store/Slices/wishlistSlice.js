import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getWishlistApi,
  addWishlistApi,
  removeWishlistApi,
} from "../../api/Wishlistapi";

// 📥 GET
export const fetchWishlist = createAsyncThunk(
  "wishlist/fetch",
  async () => {
    const res = await getWishlistApi();
    return res.data.items;
  }
);

// ➕ ADD
export const addWishlist = createAsyncThunk(
  "wishlist/add",
  async (data) => {
    const res = await addWishlistApi(data);
    return res.data.items;
  }
);

// ❌ REMOVE
export const removeWishlist = createAsyncThunk(
  "wishlist/remove",
  async (data) => {
    const res = await removeWishlistApi(data);
    return res.data.items;
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // 📥 FETCH
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })

      // ➕ ADD
      .addCase(addWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
      })

      // ❌ REMOVE
      .addCase(removeWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

export default wishlistSlice.reducer;