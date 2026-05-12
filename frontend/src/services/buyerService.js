import api from "./api";

export const registerBuyer = async (buyerData) => {
  return await api.post("/api/buyers/register", buyerData);
};

export const loginBuyer = async (loginData) => {
  return await api.post("/api/buyers/login", loginData);
};