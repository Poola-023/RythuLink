import { useEffect, useState } from "react";
import axios from "axios";

function App() {

  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8085/")
      .then((response) => {
        setMessage(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-green-100">
      <h1 className="text-5xl font-bold text-green-700 mb-4">
        RythuLink AI 🌱
      </h1>

      <p className="text-xl">
        {message}
      </p>
    </div>
  );
}

export default App;