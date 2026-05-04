import axios from "axios";

const API = "http://localhost:4000/api/cart";

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