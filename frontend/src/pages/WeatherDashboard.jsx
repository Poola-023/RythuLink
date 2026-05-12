import { useState } from "react";
import { getLiveWeather } from "../services/weatherService";


function WeatherDashboard() {
    const [city, setCity] = useState("");
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchWeather = async () => {
        if (!city.trim()) {
            alert("Please enter village or city name");
            return;
        }

        try {
            setLoading(true);

            const response =
                await getLiveWeather(city);

            setWeather(response.data);

        } catch (error) {
            console.log(error);
            alert("Weather not found. Try nearby city name.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-blue-50 p-10">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-5xl font-extrabold text-blue-700">
                        Live Weather Dashboard ⛅
                    </h1>

                    <p className="text-gray-600 text-xl mt-4">
                        Real-time weather updates for farmers.
                    </p>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-xl mb-10">
                    <div className="grid md:grid-cols-3 gap-5">
                        <input
                            type="text"
                            placeholder="Enter city e.g. Vijayawada"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="md:col-span-2 border p-4 rounded-xl text-lg"
                        />

                        <button
                            onClick={fetchWeather}
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg"
                        >
                            {loading ? "Loading..." : "Check Weather"}
                        </button>
                    </div>
                </div>

                {weather && (
                    <div className="grid lg:grid-cols-2 gap-8">
                        <div className="bg-white p-8 rounded-3xl shadow-xl">
                            <h2 className="text-4xl font-bold text-blue-700">
                                {weather.name}, {weather.sys?.country}
                            </h2>

                            <div className="text-7xl mt-8">
                                ⛅
                            </div>

                            <h3 className="text-6xl font-extrabold text-blue-600 mt-6">
                                {weather.main?.temp}°C
                            </h3>

                            <p className="text-2xl text-gray-600 mt-4 capitalize">
                                {weather.weather?.[0]?.description}
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-3xl shadow-lg">
                                <div className="text-5xl mb-4">🌡️</div>
                                <h3 className="text-2xl font-bold text-blue-700">
                                    Feels Like
                                </h3>
                                <p className="text-3xl mt-3">
                                    {weather.main?.feels_like}°C
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-3xl shadow-lg">
                                <div className="text-5xl mb-4">💧</div>
                                <h3 className="text-2xl font-bold text-blue-700">
                                    Humidity
                                </h3>
                                <p className="text-3xl mt-3">
                                    {weather.main?.humidity}%
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-3xl shadow-lg">
                                <div className="text-5xl mb-4">🌬️</div>
                                <h3 className="text-2xl font-bold text-blue-700">
                                    Wind Speed
                                </h3>
                                <p className="text-3xl mt-3">
                                    {weather.wind?.speed} m/s
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-3xl shadow-lg">
                                <div className="text-5xl mb-4">🌱</div>
                                <h3 className="text-2xl font-bold text-blue-700">
                                    Farm Advice
                                </h3>
                                <p className="text-gray-600 mt-3">
                                    {weather.main?.humidity > 75
                                        ? "High humidity. Watch for fungal diseases."
                                        : weather.main?.temp > 35
                                            ? "High temperature. Irrigate crops carefully."
                                            : "Weather is suitable for regular crop activity."}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default WeatherDashboard;