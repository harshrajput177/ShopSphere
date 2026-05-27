import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  submitRatingApi,
  getProductRatingsApi,
  getMyRatingApi,
  updateRatingApi,
  deleteRatingApi,
} from "../../api/Ratingapi";  // uploadReviewMediaApi hata diya

// ── FETCH all ratings ────────────────────────────────────────
export const fetchRatings = createAsyncThunk(
  "rating/fetch",
  async (productId) => {
    const res = await getProductRatingsApi(productId);
    return res.data;
  }
);

// ── FETCH my rating ──────────────────────────────────────────
export const fetchMyRating = createAsyncThunk(
  "rating/fetchMine",
  async (productId) => {
    const res = await getMyRatingApi(productId);
    return res.data.rating;
  }
);

// ── SUBMIT new rating ────────────────────────────────────────
export const submitRating = createAsyncThunk(
  "rating/submit",
  async ({ productId, rating, review, title, mediaFiles }, { rejectWithValue }) => {
    try {
      // FormData banao — sab ek saath backend ko bhejo
      const formData = new FormData();
      formData.append("productId", productId);
      formData.append("rating",    rating);
      if (review) formData.append("review", review);
      if (title)  formData.append("title",  title);

      // Images attach karo (File objects)
      if (mediaFiles?.images?.length) {
        mediaFiles.images.forEach((img) => formData.append("images", img));
      }

      // Video attach karo
      if (mediaFiles?.video) {
        formData.append("video", mediaFiles.video);
      }

      // Ek hi call — backend multer + cloudinary handle karega
      await submitRatingApi(formData);

      const [listRes, mineRes] = await Promise.all([
        getProductRatingsApi(productId),
        getMyRatingApi(productId),
      ]);

      return {
        ...listRes.data,
        userRating:  rating,
        myRatingDoc: mineRes.data.rating,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Submit failed");
    }
  }
);

// ── UPDATE existing rating ───────────────────────────────────
export const updateRating = createAsyncThunk(
  "rating/update",
  async (
    { productId, rating, review, title, mediaFiles, existingImages, existingVideo },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();
      formData.append("rating", rating);
      if (review) formData.append("review", review);
      if (title)  formData.append("title",  title);

      // Purani images jo rakkhni hain unke URLs bhejo
      if (existingImages?.length) {
        existingImages.forEach((url) => formData.append("existingImages", url));
      }

      // Purana video URL bhejo agar naya nahi upload kiya
      if (existingVideo && !mediaFiles?.video) {
        formData.append("existingVideo", existingVideo);
      }

      // Naye images
      if (mediaFiles?.images?.length) {
        mediaFiles.images.forEach((img) => formData.append("images", img));
      }

      // Naya video
      if (mediaFiles?.video) {
        formData.append("video", mediaFiles.video);
      }

      await updateRatingApi(productId, formData);

      const [listRes, mineRes] = await Promise.all([
        getProductRatingsApi(productId),
        getMyRatingApi(productId),
      ]);

      return {
        ...listRes.data,
        userRating:  rating,
        myRatingDoc: mineRes.data.rating,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Update failed");
    }
  }
);

// ── DELETE rating ────────────────────────────────────────────
export const deleteRating = createAsyncThunk(
  "rating/delete",
  async (productId, { rejectWithValue }) => {
    try {
      await deleteRatingApi(productId);
      const res = await getProductRatingsApi(productId);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Delete failed");
    }
  }
);

// ── Slice ────────────────────────────────────────────────────
const ratingSlice = createSlice({
  name: "rating",
  initialState: {
    ratings:     [],
    breakdown:   [],
    total:       0,
    withPhotos:  0,
    withVideos:  0,
    userRating:  null,
    myRatingDoc: null,
    loading:     false,
    submitting:  false,
    error:       null,
  },
  reducers: {
    setHoverRating: (state, action) => { state.hoverRating = action.payload; },
    clearRatings:   (state) => {
      state.ratings     = [];
      state.breakdown   = [];
      state.total       = 0;
      state.withPhotos  = 0;
      state.withVideos  = 0;
      state.userRating  = null;
      state.myRatingDoc = null;
      state.error       = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRatings.pending,   (s) => { s.loading = true; s.error = null; })
      .addCase(fetchRatings.fulfilled, (s, a) => {
        s.loading    = false;
        s.ratings    = a.payload.ratings;
        s.breakdown  = a.payload.breakdown;
        s.total      = a.payload.total;
        s.withPhotos = a.payload.withPhotos;
        s.withVideos = a.payload.withVideos;
      })
      .addCase(fetchRatings.rejected, (s) => { s.loading = false; })

      .addCase(fetchMyRating.fulfilled, (s, a) => {
        s.myRatingDoc = a.payload;
        s.userRating  = a.payload?.rating ?? null;
      })

      .addCase(submitRating.pending,   (s) => { s.submitting = true; s.error = null; })
      .addCase(submitRating.fulfilled, (s, a) => {
        s.submitting  = false;
        s.ratings     = a.payload.ratings;
        s.breakdown   = a.payload.breakdown;
        s.total       = a.payload.total;
        s.withPhotos  = a.payload.withPhotos;
        s.withVideos  = a.payload.withVideos;
        s.userRating  = a.payload.userRating;
        s.myRatingDoc = a.payload.myRatingDoc;
      })
      .addCase(submitRating.rejected, (s, a) => { s.submitting = false; s.error = a.payload; })

      .addCase(updateRating.pending,   (s) => { s.submitting = true; s.error = null; })
      .addCase(updateRating.fulfilled, (s, a) => {
        s.submitting  = false;
        s.ratings     = a.payload.ratings;
        s.breakdown   = a.payload.breakdown;
        s.total       = a.payload.total;
        s.withPhotos  = a.payload.withPhotos;
        s.withVideos  = a.payload.withVideos;
        s.userRating  = a.payload.userRating;
        s.myRatingDoc = a.payload.myRatingDoc;
      })
      .addCase(updateRating.rejected, (s, a) => { s.submitting = false; s.error = a.payload; })

      .addCase(deleteRating.pending,   (s) => { s.submitting = true; })
      .addCase(deleteRating.fulfilled, (s, a) => {
        s.submitting  = false;
        s.ratings     = a.payload.ratings;
        s.breakdown   = a.payload.breakdown;
        s.total       = a.payload.total;
        s.withPhotos  = a.payload.withPhotos;
        s.withVideos  = a.payload.withVideos;
        s.userRating  = null;
        s.myRatingDoc = null;
      })
      .addCase(deleteRating.rejected, (s, a) => { s.submitting = false; s.error = a.payload; });
  },
});

export const { setHoverRating, clearRatings } = ratingSlice.actions;
export default ratingSlice.reducer;