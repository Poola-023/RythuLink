import axios from "axios";

const API =
    "http://localhost:8085/api/admin";

// USERS
export const getUsers = async () => {

    return await axios.get(
        `${API}/users`
    );
};

export const deleteUser = async (
    id
) => {

    return await axios.delete(
        `${API}/users/${id}`
    );
};

// CROPS
export const getCrops = async () => {

    return await axios.get(
        `${API}/crops`
    );
};

export const deleteCrop = async (
    id
) => {

    return await axios.delete(
        `${API}/crops/${id}`
    );
};

// STATS
export const getStats = async () => {

    return await axios.get(
        `${API}/stats`
    );
};