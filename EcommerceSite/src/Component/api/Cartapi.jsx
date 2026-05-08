import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export const getCartApi = () =>
  axios.get(API, {
    withCredentials: true,
  });


export const addToCartApi = (data) =>
  axios.post(`${API}/add`, data, {
    withCredentials: true, // 🔥 IMPORTANT
  });


export const removeCartApi = (data) =>
  axios.post(`${API}/remove`, data, {
    withCredentials: true,
  });


export const mergeCartApi = () =>
  axios.post(`${API}/merge`, {}, {
    withCredentials: true,
  });