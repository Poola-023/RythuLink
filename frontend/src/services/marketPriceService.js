import axios from "axios";

const API_URL = "http://localhost:8085/api/market-prices";

export const getVegetablePrices = async (filters = {}) => {
  const response = await axios.get(`${API_URL}/vegetables`, {
    params: filters,
  });

  return response.data;
};

export const getFarmingProductPrices = async (filters = {}) => {
  const response = await axios.get(`${API_URL}/products`, {
    params: filters,
  });

  return response.data;
};