import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

/*
==================================================
🔥 HOME PRODUCTS FETCH (Only Once)
API: /api/products/home
==================================================
*/
export const fetchHomeProducts = createAsyncThunk(
  "products/fetchHomeProducts",
  async (_, { getState }) => {
    const state = getState();

    // cache check
    if (
      state.products.homeItems &&
      Object.keys(state.products.homeItems).length > 0
    ) {
      return state.products.homeItems;
    }

    const res = await axios.get(
      "http://localhost:4000/api/products/home"
    );

    return res.data;
  }
);

/*
==================================================
🔥 ALL PRODUCTS FETCH (Only Once)
API: /api/products/
router.get("/", getAllProducts)
==================================================
*/
export const fetchAllProducts = createAsyncThunk(
  "products/fetchAllProducts",
  async (_, { getState }) => {
    const state = getState();

    // cache check
    if (
      state.products.allItems &&
      state.products.allItems.length > 0
    ) {
      return state.products.allItems;
    }

    const res = await axios.get(
      "http://localhost:4000/api/products"
    );

    return res.data;
  }
);

/*
==================================================
🔥 SINGLE PRODUCT FETCH BY ID
API: /api/products/:id
==================================================
*/
export const fetchSingleProduct = createAsyncThunk(
  "products/fetchSingleProduct",
  async (id, { getState }) => {
    const state = getState();

    // cache check by id
    if (state.products.singleProducts[id]) {
      return state.products.singleProducts[id];
    }

    const res = await axios.get(
      `http://localhost:4000/api/products/${id}`
    );

    return {
      id,
      data: res.data.product || res.data
    };
  }
);

const productSlice = createSlice({
  name: "products",

  initialState: {
    homeItems: {},
    allItems: [],
    singleProducts: {},

    loading: false,
    error: null
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      /*
      ==============================
      HOME PRODUCTS
      ==============================
      */
      .addCase(fetchHomeProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchHomeProducts.fulfilled, (state, action) => {
        state.homeItems = action.payload;
        state.loading = false;
      })
      .addCase(fetchHomeProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      /*
      ==============================
      ALL PRODUCTS
      ==============================
      */
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.allItems = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      /*
      ==============================
      SINGLE PRODUCT
      ==============================
      */
      .addCase(fetchSingleProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSingleProduct.fulfilled, (state, action) => {
        const { id, data } = action.payload;

        state.singleProducts[id] = data;
        state.loading = false;
      })
      .addCase(fetchSingleProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export default productSlice.reducer;