import axios from "axios";

const API_URL = "http://localhost:8090/api/ai-advisor";

export const diagnoseCrop = async (formData) => {
  const response = await axios.post(`${API_URL}/diagnose`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};