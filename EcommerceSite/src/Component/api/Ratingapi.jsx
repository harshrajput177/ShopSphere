import API from "./api";

export const submitRatingApi = (formData) =>
  API.post("/api/ratings", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getProductRatingsApi = (productId) =>
  API.get(`/api/ratings/${productId}`);

export const getMyRatingApi = (productId) =>
  API.get(`/api/ratings/${productId}/mine`);

export const updateRatingApi = (productId, formData) =>
  API.put(`/api/ratings/${productId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteRatingApi = (productId) =>
  API.delete(`/api/ratings/${productId}`);

