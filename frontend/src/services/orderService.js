import api from "./api";

export const placeOrder = async (orderData) => {
  return await api.post("/api/orders", orderData);
};

export const getBuyerOrders = async (buyerId) => {
  return await api.get(`/api/orders/buyer/${buyerId}`);
};

export const getFarmerOrders = async (farmerId) => {
  return await api.get(`/api/orders/farmer/${farmerId}`);
};

export const updateOrderStatus = async (orderId, status) => {
  return await api.put(`/api/orders/${orderId}/status/${status}`);
};