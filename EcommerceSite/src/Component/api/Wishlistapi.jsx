import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";


export const getWishlistApi = () =>
  axios.get(API, {
    withCredentials: true, 
  });


export const addWishlistApi = (data) =>
  axios.post(`${API}/add`, data, {
    withCredentials: true, 
  });


export const removeWishlistApi = (data) =>
  axios.post(`${API}/remove`, data, {
    withCredentials: true, 
  });