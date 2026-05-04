import axios from "axios";

const API = "http://localhost:4000/api/wishlist";


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