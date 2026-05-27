import API from "./api"; // your shared axios instance

export const getMeApi    = ()   => API.get("/api/auth/me");
export const logoutApi   = ()   => API.post("/api/auth/logout", {});