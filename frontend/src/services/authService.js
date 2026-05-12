import axios from "axios";

const API = "http://localhost:8085/api/auth";

export const registerUser = async (userData) => {

    return await axios.post(
        `${API}/register`,
        userData,
        {
            headers: {
                "Content-Type": "application/json"
            }
        }
    );
};

export const loginUser = async (userData) => {

    return await axios.post(
        `${API}/login`,
        userData,
        {
            headers: {
                "Content-Type": "application/json"
            }
        }
    );
};