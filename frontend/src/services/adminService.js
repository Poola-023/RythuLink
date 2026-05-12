import api from "./api";

// USERS
export const getUsers = async () => {
  return await api.get("/api/admin/users");
};

export const deleteUser = async (id) => {
  return await api.delete(`/api/admin/users/${id}`);
};

// CROPS
export const getCrops = async () => {
  return await api.get("/api/admin/crops");
};

export const deleteCrop = async (id) => {
  return await api.delete(`/api/admin/crops/${id}`);
};

// STATS
export const getStats = async () => {
  return await api.get("/api/admin/stats");
};