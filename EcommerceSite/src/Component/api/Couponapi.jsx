import API from "./api";

export const fetchAllCouponsApi = () =>
  API.get(`/api/coupons/product/all`);

export const fetchProductCouponsApi = (productId) => 
  API.get(`/api/coupons/product/${productId}`);

export const applyCouponApi = (data) => 
  API.post("/api/coupons/apply", data);

