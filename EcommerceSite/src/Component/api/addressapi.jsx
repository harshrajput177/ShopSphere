import API from "./api";

export const getAddressesApi  = ()         => API.get("/api/address");
export const addAddressApi    = (data)     => API.post("/api/address", data);
export const updateAddressApi = (id, data) => API.put(`/api/address/${id}`, data);
export const deleteAddressApi = (id)       => API.delete(`/api/address/${id}`);