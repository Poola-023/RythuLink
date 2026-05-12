import api from "./api";

export const getVegetablePrices = async (filters = {}) => {
  const response = await api.get("/api/market-prices/vegetables", {
    params: filters,
  });

  return response.data;
};

export const getFarmingProductPrices = async (filters = {}) => {
  const response = await api.get("/api/market-prices/products", {
    params: filters,
  });

  return response.data;
};