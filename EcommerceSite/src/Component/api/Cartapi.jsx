import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

const API = `${BASE_URL}/api/cart`;

export const getCartApi = async () => {
  try {
    return await axios.get(API, { withCredentials: true });
  } catch (err) {
    if (err.response?.status === 502) {
      // 3 second wait karke retry karo
      await new Promise(resolve => setTimeout(resolve, 3000));
      return await axios.get(API, { withCredentials: true });
    }
    throw err;
  }
};


export const addToCartApi = (data) =>
  axios.post(`${API}/add`, data, {
    withCredentials: true,
  });

//  REMOVE
export const removeCartApi = (data) =>
  axios.post(`${API}/remove`, data, {
    withCredentials: true,
  });

//  MERGE
export const mergeCartApi = () =>
  axios.post(`${API}/merge`, {}, {
    withCredentials: true,
  });