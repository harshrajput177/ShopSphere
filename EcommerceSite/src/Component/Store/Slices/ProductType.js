import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/api";

// 🔥 Async thunk (API call)
export const fetchProductTypes = createAsyncThunk(
  "productType/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/api/product-type");
      return res.data?.productTypes || res.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error");
    }
  }
);

const productTypeSlice = createSlice({
  name: "productType",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchProductTypes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchProductTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productTypeSlice.reducer;