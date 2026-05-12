import { useState } from "react";
import { diagnoseCrop } from "../services/aiAdvisorService";
import "./AIAdvisor.css";

function AIAdvisor() {
    const [cropName, setCropName] = useState("");
    const [symptoms, setSymptoms] = useState("");
    const [location, setLocation] = useState("");
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState("");
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);

    const handleImage = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

        if (!allowedTypes.includes(file.type)) {
            alert("Please upload only JPG, PNG, WEBP, or GIF image.");
            e.target.value = "";
            setImage(null);
            setPreview("");
            return;
        }

        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleDiagnose = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("cropName", cropName);
        formData.append("symptoms", symptoms);
        formData.append("location", location);

        if (image) {
            formData.append("image", image);
        }

        try {
            setLoading(true);
            setResult("");

            const data = await diagnoseCrop(formData);
            setResult(data.result);
        } catch (error) {
            console.error(error);

            const message =
                error.response?.data?.message ||
                error.response?.data?.error ||
                "AI diagnosis failed. Please check backend/API key.";

            setResult(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ai-page">
            <section className="ai-hero">
                <div>
                    <p className="ai-tag">Plantix Style AI Crop Doctor</p>
                    <h1>AI Crop Disease Detection</h1>
                    <p>
                        Upload crop leaf image, enter symptoms and get instant farming advice.
                    </p>
                </div>

                <div className="ai-live-card">
                    <span>🤖 AI Advisor</span>
                    <h3>Live crop diagnosis</h3>
                    <p>Image + symptoms + location based result</p>
                </div>
            </section>

            <section className="ai-grid">
                <form className="ai-form" onSubmit={handleDiagnose}>
                    <label>Crop Name</label>
                    <input
                        value={cropName}
                        onChange={(e) => setCropName(e.target.value)}
                        placeholder="Example: Tomato"
                    />

                    <label>Location</label>
                    <input
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Example: Kadapa"
                    />

                    <label>Symptoms</label>
                    <textarea
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                        placeholder="Example: Yellow spots, leaf curling, black marks..."
                    />

                    <label>Upload Crop Image</label>
                    <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        onChange={handleImage}
                    />

                    {preview && <img src={preview} alt="Crop preview" className="preview-img" />}

                    <button type="submit" disabled={loading}>
                        {loading ? "Analyzing..." : "Analyze Crop"}
                    </button>
                </form>

                <div className="ai-result">
                    <h2>Live Result</h2>

                    {!result && !loading && (
                        <p className="empty-result">
                            Your AI crop diagnosis will appear here.
                        </p>
                    )}

                    {loading && <div className="loader">Checking crop health...</div>}

                    {result && (
                        <pre>{result}</pre>
                    )}
                </div>
            </section>
        </div>
    );
}

export default AIAdvisor;