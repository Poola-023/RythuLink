import axios from "axios";

const API = "http://localhost:8085/api/orders";

export const placeOrder = async (orderData) => {
    return await axios.post(API, orderData);
};

export const getBuyerOrders = async (buyerId) => {
    return await axios.get(`${API}/buyer/${buyerId}`);
};

export const getFarmerOrders = async (farmerId) => {
    return await axios.get(`${API}/farmer/${farmerId}`);
};

export const updateOrderStatus = async (orderId, status) => {
    return await axios.put(`${API}/${orderId}/status/${status}`);
};