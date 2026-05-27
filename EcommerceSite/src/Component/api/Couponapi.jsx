import API from "./api";

export const fetchProductCouponsApi = (productId) => 
  API.get(`/api/coupons/product/${productId}`);

export const applyCouponApi = (data) => 
  API.post("/api/coupons/apply", data);