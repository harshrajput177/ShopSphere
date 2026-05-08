import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

const API = `${BASE_URL}/api/cart`;

// ✅ GET CART
export const getCartApi = () =>
  axios.get(API, {
    withCredentials: true,
  });

// ✅ ADD
export const addToCartApi = (data) =>
  axios.post(`${API}/add`, data, {
    withCredentials: true,
  });

// ✅ REMOVE
export const removeCartApi = (data) =>
  axios.post(`${API}/remove`, data, {
    withCredentials: true,
  });

// ✅ MERGE
export const mergeCartApi = () =>
  axios.post(`${API}/merge`, {}, {
    withCredentials: true,
  });