import axios from "axios";

const API = "http://localhost:8085/api/buyers";

export const registerBuyer = async (buyerData) => {
    return await axios.post(`${API}/register`, buyerData);
};

export const loginBuyer = async (loginData) => {
    return await axios.post(`${API}/login`, loginData);
};