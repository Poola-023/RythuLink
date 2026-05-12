import api from "./api";

export const getLiveWeather = async (city) => {
  return await api.get(`/api/weather/${city}`);
};