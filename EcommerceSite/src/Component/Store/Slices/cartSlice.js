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
      return rejectWithValue(err.response?.data || "Fetch error");
    }
  }
);


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
        if (action.payload) {
  state.items = action.payload;
}
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
       if (action.payload) {
  state.items = action.payload;
}
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
      if (action.payload) {
  state.items = action.payload;
}
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
      if (action.payload) {
  state.items = action.payload;
}
      })
      .addCase(mergeCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;