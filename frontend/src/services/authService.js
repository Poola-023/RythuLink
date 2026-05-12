import api from "./api";


export const registerUser = async (userData) => {
  return await api.post("/api/auth/register", userData);
};

export const loginUser = async (loginData) => {
  return await api.post("/api/auth/login", loginData);
};