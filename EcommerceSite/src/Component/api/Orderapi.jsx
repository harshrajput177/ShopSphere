import API from "./api";

export const createOrderApi        = (data)      => API.post("/api/orders", data);
export const getMyOrdersApi        = ()           => API.get("/api/orders/my-orders");
export const getOrderByIdApi       = (id)         => API.get(`/api/orders/${id}`);
export const cancelOrderApi        = (id, reason) => API.put(`/api/orders/${id}/cancel`, { reason });
export const createRazorpayOrderApi= (amount)     => API.post("/api/payment/create-order", { amount });
export const verifyPaymentApi      = (data)       => API.post("/api/payment/verify", data);