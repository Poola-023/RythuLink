import axios from "axios";

const API = "http://localhost:8085/api/crops";

export const addCrop = async (cropData) => {
    return await axios.post(API, cropData);
};

export const getAllCrops = async () => {
    return await axios.get(API);
};

export const getFarmerCrops = async (farmerId) => {
    return await axios.get(`${API}/farmer/${farmerId}`);
};

export const deleteCrop = async (cropId) => {
    return await axios.delete(`${API}/${cropId}`);
};