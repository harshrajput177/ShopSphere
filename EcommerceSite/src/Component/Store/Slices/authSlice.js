import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL ="http://localhost:4000";
const API = `${BASE_URL}/api/auth`;

// Shared axios instance with credentials always enabled
const authAxios = axios.create({
  baseURL: API,
  withCredentials: true, 
});

// 👤 GET USER
export const getMe = createAsyncThunk(
  "auth/getMe",
  async (_, { rejectWithValue }) => {
    try {
      const res = await authAxios.get("/me");
      return res.data.user;
    } catch (error) {
      const status = error.response?.status;

      // ✅ 401 = not logged in (expected) — don't treat as a crash
      if (status === 401 || status === 403) {
        return rejectWithValue(null); // silently clear user
      }

      // ✅ Other errors (500, network) — report them
      return rejectWithValue(error.response?.data?.message || "Failed to fetch user");
    }
  }
);

// 🚪 LOGOUT
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await authAxios.post("/logout", {});
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: true, // ✅ Start true — assume auth check is in progress on app load
    error: null,
    authChecked: false, // ✅ Track if initial /me check is done
  },

  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearAuth: (state) => {
      state.user = null;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // 👤 GET ME
      .addCase(getMe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.authChecked = true; // ✅ Auth check complete
      })
      .addCase(getMe.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.authChecked = true; 
        // Only store error if it's a real error (not just "not logged in")
        state.error = action.payload || null;
      })

      // 🚪 LOGOUT
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.error = null;
        state.authChecked = true;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setUser, clearAuth } = authSlice.actions;
export default authSlice.reducer;