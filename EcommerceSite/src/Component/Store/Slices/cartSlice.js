import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getCartApi,
  addToCartApi,
  removeCartApi,
  mergeCartApi,
} from "../../api/Cartapi";

export const fetchCart = createAsyncThunk(
  "cart/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getCartApi();
      return res.data?.items || [];
    } catch (err) {
      // 502 = backend so raha hai, retry karo
      if (err.response?.status === 502 || err.code === "ERR_NETWORK") {
        await new Promise(resolve => setTimeout(resolve, 4000)); // 4 sec wait
        try {
          const retry = await getCartApi();
          return retry.data?.items || [];
        } catch (retryErr) {
          return rejectWithValue("Server start ho raha hai...");
        }
      }
      return rejectWithValue(err.response?.data || "Fetch error");
    }
  }
);
// ADD
export const addCart = createAsyncThunk(
  "cart/add",
  async (data, { rejectWithValue }) => {
    try {
      const res = await addToCartApi(data);
      return res.data?.items || [];
    } catch (err) {
      return rejectWithValue(err.response?.data || "Add error");
    }
  }
);

//  REMOVE
export const removeCart = createAsyncThunk(
  "cart/remove",
  async (data, { rejectWithValue }) => {
    try {
      const res = await removeCartApi(data);
      return res.data?.items || [];
    } catch (err) {
      return rejectWithValue(err.response?.data || "Remove error");
    }
  }
);

//  MERGE
export const mergeCart = createAsyncThunk(
  "cart/merge",
  async (_, { rejectWithValue }) => {
    try {
      const res = await mergeCartApi();
      return res.data?.items || [];
    } catch (err) {
      return rejectWithValue(err.response?.data || "Merge error");
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },

  reducers: {
    clearCart: (state) => {
      state.items = [];
    },
  },

  extraReducers: (builder) => {
    builder

      // FETCH
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ADD
      .addCase(addCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(addCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // REMOVE
      .addCase(removeCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(removeCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // MERGE
      .addCase(mergeCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(mergeCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(mergeCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;