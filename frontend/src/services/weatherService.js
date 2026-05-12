import axios from "axios";

const WEATHER_API =
    "http://localhost:8085/api/weather";

export const getLiveWeather =
    async (city) => {

        return await axios.get(
            `${WEATHER_API}/${city}`
        );
    };