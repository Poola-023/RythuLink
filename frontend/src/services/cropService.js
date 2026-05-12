import api from "./api";

export const addCrop = async (cropData) => {
  return await api.post("/api/crops", cropData);
};

export const getAllCrops = async () => {
  return await api.get("/api/crops");
};

export const getFarmerCrops = async (farmerId) => {
  return await api.get(`/api/crops/farmer/${farmerId}`);
};

export const deleteCrop = async (cropId) => {
  return await api.delete(`/api/crops/${cropId}`);
};

export const updateCrop = async (cropId, cropData) => {
  return await api.put(`/api/crops/${cropId}`, cropData);
};

export const getCropById = async (cropId) => {
  return await api.get(`/api/crops/${cropId}`);
};