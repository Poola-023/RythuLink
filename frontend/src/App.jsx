import { useEffect, useState } from "react";
import api, { API_BASE_URL } from "./services/api";

function App() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [backendStatus, setBackendStatus] = useState("Checking backend...");

  useEffect(() => {
    checkBackend();
  }, []);

  const checkBackend = async () => {
    try {
      setLoading(true);

      const response = await api.get("/");

      setMessage(response.data);
      setBackendStatus("Backend Connected ✅");
    } catch (error) {
      console.log("BACKEND CONNECTION ERROR:", error);

      setMessage("Backend not connected");
      setBackendStatus("Backend Connection Failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 via-emerald-50 to-lime-100 px-6">
      <div className="bg-white rounded-[2rem] shadow-2xl border border-green-100 p-10 text-center max-w-2xl w-full">
        <div className="h-20 w-20 bg-gradient-to-br from-green-600 to-emerald-400 rounded-3xl flex items-center justify-center text-5xl mx-auto shadow-lg">
          🌱
        </div>

        <h1 className="text-5xl font-black text-green-700 mt-6">
          RythuLink AI
        </h1>

        <p className="text-slate-500 font-semibold mt-3">
          Smart farming platform for farmers
        </p>

        <div className="bg-green-50 border border-green-100 rounded-3xl p-6 mt-8">
          <p className="text-sm font-black text-slate-500">
            Backend Status
          </p>

          <h2 className="text-2xl font-black text-slate-900 mt-2">
            {loading ? "Checking..." : backendStatus}
          </h2>

          <p className="text-green-700 font-bold mt-3">
            {loading ? "Please wait..." : message}
          </p>
        </div>

        <div className="bg-slate-50 rounded-3xl p-5 mt-6 text-left">
          <p className="text-sm font-black text-slate-500">
            Current API URL
          </p>

          <p className="text-slate-800 font-bold break-all mt-2">
            {API_BASE_URL}
          </p>
        </div>

        <button
          onClick={checkBackend}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-2xl font-black mt-8"
        >
          Recheck Backend
        </button>
      </div>
    </div>
  );
}

export default App;