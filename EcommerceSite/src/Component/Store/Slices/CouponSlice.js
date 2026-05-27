import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchProductCouponsApi, applyCouponApi } from "../../api/Couponapi";

export const fetchProductCoupons = createAsyncThunk(
  "coupon/fetchForProduct",
  async (productId) => {
    const res = await fetchProductCouponsApi(productId);
    return res.data;
  }
);

export const applyCoupon = createAsyncThunk(
  "coupon/apply",
  async ({ code, orderAmount, productId }, { rejectWithValue }) => {
    try {
      const res = await applyCouponApi({ code, orderAmount, productId });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Invalid coupon");
    }
  }
);

const couponSlice = createSlice({
  name: "coupon",
  initialState: {
    available: [],
    applied: null,
    discount: 0,
    error: "",
    loading: false,
  },
  reducers: {
    removeCoupon: (state) => {
      state.applied = null;
      state.discount = 0;
      state.error = "";
    },
    clearCouponError: (state) => { state.error = ""; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductCoupons.fulfilled, (state, action) => {
        state.available = action.payload;
      })
      .addCase(applyCoupon.pending, (state) => {
        state.loading = true; state.error = "";
      })
      .addCase(applyCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.applied = action.payload.code;
        state.discount = action.payload.discount;
      })
      .addCase(applyCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.applied = null;
        state.discount = 0;
      });
  },
});

export const { removeCoupon, clearCouponError } = couponSlice.actions;
export default couponSlice.reducer;