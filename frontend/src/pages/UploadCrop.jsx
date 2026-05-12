import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { addCrop } from "../services/cropService";
import { uploadImage } from "../services/imageService";

const cropOptions = [
  { name: "Rice", type: "Cereal", duration: 6, icon: "🌾", defaultYield: 2500 },
  { name: "Paddy", type: "Cereal", duration: 6, icon: "🌾", defaultYield: 2500 },
  { name: "Tomato", type: "Vegetable", duration: 4, icon: "🍅", defaultYield: 10000 },
  { name: "Chilli", type: "Spice", duration: 5, icon: "🌶️", defaultYield: 2500 },
  { name: "Onion", type: "Vegetable", duration: 4, icon: "🧅", defaultYield: 8000 },
  { name: "Cotton", type: "Commercial Crop", duration: 6, icon: "☁️", defaultYield: 800 },
  { name: "Maize", type: "Cereal", duration: 4, icon: "🌽", defaultYield: 2800 },
  { name: "Groundnut", type: "Oilseed", duration: 4, icon: "🥜", defaultYield: 1200 },
  { name: "Turmeric", type: "Spice", duration: 8, icon: "🟡", defaultYield: 8000 },
  { name: "Wheat", type: "Cereal", duration: 4, icon: "🌾", defaultYield: 1800 },
];

function UploadCrop() {
  const navigate = useNavigate();

  const farmerId = localStorage.getItem("farmerId");
  const farmerName = localStorage.getItem("farmerName");
  const farmerPhone = localStorage.getItem("farmerPhone");

  const [formData, setFormData] = useState({
    cropName: "",
    landAcres: "",
    investmentAmount: "",
    expectedYieldPerAcre: "",
    expectedPricePerKg: "",
    location: "",
    sowingDate: "",
    description: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [showOptional, setShowOptional] = useState(false);
  const [loading, setLoading] = useState(false);

  const selectedCrop = useMemo(() => {
    return cropOptions.find((crop) => crop.name === formData.cropName);
  }, [formData.cropName]);

  const acres = Number(formData.landAcres || 0);
  const investment = Number(formData.investmentAmount || 0);
  const expectedYieldPerAcre = Number(formData.expectedYieldPerAcre || 0);
  const expectedPricePerKg = Number(formData.expectedPricePerKg || 0);

  const calculatedQuantity = acres * expectedYieldPerAcre;
  const estimatedSaleValue = calculatedQuantity * expectedPricePerKg;
  const estimatedProfit = estimatedSaleValue - investment;

  const cropPlan = useMemo(() => {
    return getCropPlan(formData.cropName, acres || 1);
  }, [formData.cropName, acres]);

  const expectedHarvestDate = useMemo(() => {
    if (!formData.sowingDate || !selectedCrop?.duration) return "";

    const date = new Date(formData.sowingDate);
    date.setMonth(date.getMonth() + selectedCrop.duration);

    return date.toISOString().split("T")[0];
  }, [formData.sowingDate, selectedCrop]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "cropName") {
      const crop = cropOptions.find((item) => item.name === value);

      setFormData((prev) => ({
        ...prev,
        cropName: value,
        expectedYieldPerAcre: crop?.defaultYield || "",
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const buildFinalDescription = () => {
    const guideText = cropPlan.stages
      .map((item, index) => {
        return `${index + 1}. ${item.stage}
When: ${item.time}
What to do: ${item.action}
Per Acre: ${item.perAcre}
For ${acres || 1} Acre(s): ${item.total}
Why: ${item.reason}`;
      })
      .join("\n\n");

    const pestText = cropPlan.pests
      .map((item, index) => `${index + 1}. ${item.name}: ${item.action}`)
      .join("\n");

    return `
${formData.description || "No extra description added."}

==============================
CROP BASIC DETAILS
==============================
Crop Name: ${formData.cropName}
Crop Type: ${selectedCrop?.type || "Not specified"}
Land Area: ${formData.landAcres || 0} acres
Crop Duration: ${selectedCrop?.duration || cropPlan.duration} months
Investment Till Now: ₹${formData.investmentAmount || 0}

Sowing Date: ${formData.sowingDate || "Not added"}
Expected Harvest Date: ${expectedHarvestDate || "Not calculated"}

Expected Yield Per Acre: ${formData.expectedYieldPerAcre || 0} KG
Quantity Calculation: ${formData.landAcres || 0} acres × ${
      formData.expectedYieldPerAcre || 0
    } KG = ${calculatedQuantity} KG

Expected Quantity: ${calculatedQuantity} KG
Expected Selling Price: ₹${formData.expectedPricePerKg || 0}/KG
Value Calculation: ${calculatedQuantity} KG × ₹${
      formData.expectedPricePerKg || 0
    } = ₹${estimatedSaleValue}

Estimated Sale Value: ₹${estimatedSaleValue}
Estimated Profit Before Extra Expenses: ₹${estimatedProfit}

Location: ${formData.location || "Not specified"}

==============================
FARMING GUIDE PER ACRE BASIS
==============================
Success in crop farming depends on timing nutrients with crop growth stages.

${guideText}

==============================
PEST AND DISEASE MONITORING
==============================
${pestText}

==============================
FARMER SUCCESS TIPS
==============================
${cropPlan.tips.map((tip) => `✅ ${tip}`).join("\n")}

Important Note:
This is a general farming guide. Final fertilizer and pesticide use should be adjusted based on soil test, crop variety, water availability, pest level, local weather, and agriculture officer/KVK advice.
    `.trim();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!farmerId) {
      alert("Farmer not logged in. Please login again.");
      navigate("/login");
      return;
    }

    if (
      !formData.cropName ||
      !formData.landAcres ||
      !formData.investmentAmount ||
      !formData.expectedYieldPerAcre ||
      !formData.expectedPricePerKg
    ) {
      alert(
        "Please fill Crop Name, Acres, Investment Amount, Expected Yield per Acre and Expected Price per KG."
      );
      return;
    }

    if (!image) {
      alert("Please upload crop image.");
      return;
    }

    try {
      setLoading(true);

      const uploadResponse = await uploadImage(image);
      const imageUrl = uploadResponse.data;

      const cropData = {
        cropName: formData.cropName,

        // These fields are your existing backend fields.
        quantity: Number(calculatedQuantity || 0),
        price: Number(expectedPricePerKg || 0),
        location: formData.location || "Not specified",
        description: buildFinalDescription(),
        imageUrl,

        farmerId,
        farmerName: farmerName || "Farmer",
        farmerPhone: farmerPhone || "",
      };

      console.log("CROP DATA:", cropData);

      await addCrop(cropData);

      alert("Crop Uploaded Successfully ✅");

      setFormData({
        cropName: "",
        landAcres: "",
        investmentAmount: "",
        expectedYieldPerAcre: "",
        expectedPricePerKg: "",
        location: "",
        sowingDate: "",
        description: "",
      });

      setImage(null);
      setPreview("");
      setShowOptional(false);

      navigate("/my-crops");
    } catch (error) {
      console.log("UPLOAD ERROR:", error);
      alert("Upload Failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f8f5] text-slate-900">
      <nav className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-[88px] flex items-center justify-between">
          <div
            className="flex items-center gap-4 cursor-pointer"
            onClick={() => navigate("/upload")}
          >
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-green-600 to-emerald-400 flex items-center justify-center shadow-lg">
              <span className="text-3xl">🌱</span>
            </div>

            <div>
              <h1 className="text-3xl font-black tracking-tight">
                Upload Crop
              </h1>
              <p className="text-sm text-slate-500">
                Simple crop entry with auto quantity, value and farming guide
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/my-crops")}
            className="bg-green-600 text-white px-5 py-3 rounded-xl font-bold"
          >
            My Crops
          </button>
        </div>
      </nav>

      <section className="bg-gradient-to-br from-green-950 via-green-800 to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-14 grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
          <div>
            <p className="text-green-100 font-bold mb-4">
              Simple Farmer Crop Entry
            </p>

            <h2 className="text-5xl lg:text-6xl font-black leading-tight">
              Enter crop details. We calculate quantity and value.
            </h2>

            <p className="text-green-50 text-lg leading-8 mt-6">
              Farmer enters crop name, acres, investment, expected yield per
              acre, expected price and crop image. The app calculates total
              quantity, sale value and profit automatically.
            </p>
          </div>

          <div className="bg-white/15 border border-white/20 backdrop-blur rounded-[2rem] p-6">
            <div className="grid grid-cols-2 gap-4">
              <HeroMetric
                title="Crop"
                value={
                  selectedCrop
                    ? `${selectedCrop.icon} ${selectedCrop.name}`
                    : "Select Crop"
                }
              />
              <HeroMetric title="Land" value={`${acres || 0} Acres`} />
              <HeroMetric
                title="Quantity"
                value={`${calculatedQuantity.toLocaleString()} KG`}
              />
              <HeroMetric
                title="Sale Value"
                value={`₹${estimatedSaleValue.toLocaleString()}`}
              />
            </div>

            <div className="bg-white text-slate-900 rounded-3xl p-5 mt-5">
              <p className="text-slate-500 font-bold">Formula</p>
              <h3 className="text-xl font-black text-green-700 mt-1">
                Quantity = Acres × Yield per Acre
              </h3>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-10 grid lg:grid-cols-[0.9fr_1.1fr] gap-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-[2rem] shadow-xl border border-slate-100 p-8 -mt-20 relative z-10"
        >
          <div className="mb-8">
            <h2 className="text-3xl font-black text-slate-900">
              Basic Crop Details
            </h2>
            <p className="text-slate-500 mt-2">
              Fill these simple fields. Quantity and value are calculated
              automatically.
            </p>
          </div>

          <div className="space-y-5">
            <Field label="1. Crop Name">
              <select
                name="cropName"
                value={formData.cropName}
                onChange={handleChange}
                className="input"
                required
              >
                <option value="">Select Crop</option>
                {cropOptions.map((crop) => (
                  <option key={crop.name} value={crop.name}>
                    {crop.icon} {crop.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="2. How many acres?">
              <input
                type="number"
                step="0.1"
                name="landAcres"
                value={formData.landAcres}
                onChange={handleChange}
                placeholder="Example: 3"
                className="input"
                required
              />
            </Field>

            <Field label="3. Investment amount till now">
              <input
                type="number"
                name="investmentAmount"
                value={formData.investmentAmount}
                onChange={handleChange}
                placeholder="Example: 45000"
                className="input"
                required
              />
            </Field>

            <Field label="4. Expected Yield per Acre">
              <input
                type="number"
                name="expectedYieldPerAcre"
                value={formData.expectedYieldPerAcre}
                onChange={handleChange}
                placeholder="Example: Rice 2500 KG per acre"
                className="input"
                required
              />
              <p className="text-sm text-slate-500 mt-2">
                Quantity = Acres × Yield per Acre
              </p>
            </Field>

            <Field label="5. Expected Selling Price per KG">
              <input
                type="number"
                name="expectedPricePerKg"
                value={formData.expectedPricePerKg}
                onChange={handleChange}
                placeholder="Example: 25"
                className="input"
                required
              />
              <p className="text-sm text-slate-500 mt-2">
                Value = Quantity × Price per KG
              </p>
            </Field>

            <Field label="6. Crop Image">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="input"
                required
              />
            </Field>

            {preview && (
              <img
                src={preview}
                alt="Crop preview"
                className="w-full h-72 object-cover rounded-3xl"
              />
            )}
          </div>

          <div className="bg-green-50 border border-green-100 rounded-[2rem] p-6 mt-6">
            <h3 className="text-2xl font-black text-green-800">
              Quantity & Value Calculation
            </h3>

            <div className="grid md:grid-cols-3 gap-4 mt-5">
              <MiniInfo
                label="Expected Quantity"
                value={`${calculatedQuantity.toLocaleString()} KG`}
              />

              <MiniInfo
                label="Estimated Sale Value"
                value={`₹${estimatedSaleValue.toLocaleString()}`}
              />

              <MiniInfo
                label="Profit After Investment"
                value={`₹${estimatedProfit.toLocaleString()}`}
              />
            </div>

            <div className="bg-white rounded-2xl p-4 mt-5 text-slate-700 font-semibold">
              <p>
                Quantity = {acres || 0} acres × {expectedYieldPerAcre || 0} KG
                per acre ={" "}
                <b>{calculatedQuantity.toLocaleString()} KG</b>
              </p>

              <p className="mt-2">
                Value = {calculatedQuantity.toLocaleString()} KG × ₹
                {expectedPricePerKg || 0} ={" "}
                <b>₹{estimatedSaleValue.toLocaleString()}</b>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowOptional(!showOptional)}
            className="w-full bg-slate-100 text-slate-800 py-4 rounded-2xl font-black text-lg mt-8"
          >
            {showOptional
              ? "Hide Optional Details"
              : "Add Optional Details"}
          </button>

          {showOptional && (
            <div className="bg-slate-50 rounded-[2rem] p-6 mt-5 space-y-5">
              <h3 className="text-2xl font-black text-slate-900">
                Optional Details
              </h3>

              <Field label="Location">
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Village / District / State"
                  className="input"
                />
              </Field>

              <Field label="Sowing / Transplanting Date">
                <input
                  type="date"
                  name="sowingDate"
                  value={formData.sowingDate}
                  onChange={handleChange}
                  className="input"
                />
              </Field>

              <Field label="Extra Notes">
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Example: water source, variety, soil type, crop condition..."
                  className="input min-h-[120px]"
                />
              </Field>
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-4 mt-8">
            <SummaryCard title="Crop Type" value={selectedCrop?.type || "-"} />
            <SummaryCard
              title="Crop Cycle"
              value={`${selectedCrop?.duration || cropPlan.duration} months`}
            />
            <SummaryCard
              title="Profit"
              value={`₹${estimatedProfit.toLocaleString()}`}
              danger={estimatedProfit < 0}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-slate-400 text-white py-4 rounded-2xl font-black text-lg mt-8"
          >
            {loading ? "Uploading Crop..." : "Upload Crop & Create Guide"}
          </button>
        </form>

        <section className="space-y-6 lg:-mt-20 relative z-10">
          <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-green-700 font-black">Auto Farming Guide</p>
                <h3 className="text-3xl font-black text-slate-900 mt-2">
                  {formData.cropName || "Select a crop"}
                </h3>
                <p className="text-slate-500 mt-2">
                  Per-acre basis and total requirement for your land.
                </p>
              </div>

              <div className="h-16 w-16 bg-green-100 rounded-3xl flex items-center justify-center text-4xl">
                {selectedCrop?.icon || "🌱"}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <MiniInfo label="Land" value={`${acres || 0} acres`} />
              <MiniInfo
                label="Duration"
                value={`${selectedCrop?.duration || cropPlan.duration} months`}
              />
              <MiniInfo label="Stages" value={`${cropPlan.stages.length} steps`} />
            </div>
          </div>

          <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 p-7">
            <h3 className="text-2xl font-black text-slate-900">
              Farming Guide — Easy View
            </h3>

            <p className="text-slate-500 mt-2">
              Success in crop farming depends on timing the nutrients with the
              growth stages.
            </p>

            <div className="space-y-4 mt-6">
              {cropPlan.stages.map((item, index) => (
                <div
                  key={index}
                  className="border border-green-100 bg-green-50 rounded-3xl p-5"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 bg-green-600 text-white rounded-2xl flex items-center justify-center font-black">
                      {index + 1}
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <h4 className="text-xl font-black text-green-800">
                          {item.stage}
                        </h4>

                        <span className="bg-white text-green-700 px-4 py-2 rounded-full text-sm font-black">
                          {item.time}
                        </span>
                      </div>

                      <p className="text-slate-700 font-semibold mt-3">
                        {item.action}
                      </p>

                      <div className="grid md:grid-cols-2 gap-3 mt-4">
                        <MiniInfo label="Per Acre" value={item.perAcre} />
                        <MiniInfo
                          label={`For ${acres || 1} acre(s)`}
                          value={item.total}
                        />
                      </div>

                      <p className="text-sm text-slate-500 mt-3">
                        {item.reason}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="bg-slate-900 text-white rounded-[2rem] shadow-xl p-7">
              <h3 className="text-2xl font-black">Pest Check</h3>

              <div className="space-y-4 mt-5">
                {cropPlan.pests.map((item, index) => (
                  <div key={index} className="bg-white/10 rounded-2xl p-4">
                    <p className="font-black text-green-200">{item.name}</p>
                    <p className="text-slate-300 text-sm mt-1">{item.action}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-[2rem] shadow-xl p-7">
              <h3 className="text-2xl font-black text-amber-900">
                Farmer Tips
              </h3>

              <div className="space-y-3 mt-5">
                {cropPlan.tips.map((tip, index) => (
                  <p key={index} className="text-amber-900 font-semibold">
                    ✅ {tip}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <style>{`
        .input {
          width: 100%;
          border: 1px solid #e2e8f0;
          border-radius: 1rem;
          padding: 0.95rem 1rem;
          outline: none;
          font-weight: 600;
          background: white;
        }

        .input:focus {
          border-color: #16a34a;
          box-shadow: 0 0 0 4px rgba(22, 163, 74, 0.12);
        }
      `}</style>
    </div>
  );
}

function getCropPlan(cropName, acres) {
  const crop = String(cropName || "").toLowerCase();

  const amount = (value, unit) =>
    `${formatAmount(Number(value) * Number(acres || 1))} ${unit}`;

  if (crop.includes("rice") || crop.includes("paddy")) {
    return {
      duration: 6,
      shortAdvice:
        "Rice needs split fertilizer at land preparation, tillering and mid-growth stages.",
      stages: [
        {
          stage: "Land Preparation",
          time: "Before transplanting",
          action: "Apply Farmyard Manure and SSP as basal dose.",
          perAcre: "10 tons FYM + 100 kg SSP",
          total: `${amount(10, "tons FYM")} + ${amount(100, "kg SSP")}`,
          reason: "Improves soil structure and gives phosphorus for strong roots.",
        },
        {
          stage: "Early Tillering",
          time: "15–20 days after transplanting",
          action: "Apply Urea and Zinc Sulphate.",
          perAcre: "30–40 kg Urea + 10 kg Zinc Sulphate",
          total: `${amount(35, "kg Urea")} + ${amount(
            10,
            "kg Zinc Sulphate"
          )}`,
          reason: "Urea supports green growth and zinc helps reduce yellowing.",
        },
        {
          stage: "Mid Growth",
          time: "40–50 days after transplanting",
          action: "Apply Urea and MOP.",
          perAcre: "30 kg Urea + 20 kg MOP",
          total: `${amount(30, "kg Urea")} + ${amount(20, "kg MOP")}`,
          reason:
            "Potash improves stem strength, pest tolerance and grain filling.",
        },
        {
          stage: "Grain Filling",
          time: "After flowering",
          action: "Avoid excess nitrogen and maintain water carefully.",
          perAcre: "No heavy urea",
          total: "Avoid unnecessary fertilizer",
          reason: "Improves grain quality and reduces lodging risk.",
        },
      ],
      pests: [
        {
          name: "Stem Borer",
          action: "Check dead hearts and white ear heads every week.",
        },
        {
          name: "Leaf Folder",
          action: "Check folded leaves. Avoid excess urea.",
        },
        {
          name: "Blast / Brown Spot",
          action: "Watch leaf spots after humid or cloudy weather.",
        },
      ],
      tips: [
        "Do not apply all urea at once. Split it by crop stage.",
        "Balance urea with potash for better grain quality.",
        "Drain field before harvest for better drying and quality.",
      ],
    };
  }

  if (crop.includes("tomato")) {
    return {
      duration: 4,
      shortAdvice:
        "Tomato needs balanced nutrients, staking, pest monitoring and careful watering.",
      stages: [
        {
          stage: "Land Preparation",
          time: "Before planting",
          action: "Apply FYM and basal fertilizer.",
          perAcre: "6–8 tons FYM",
          total: amount(7, "tons FYM"),
          reason: "Improves soil fertility and root development.",
        },
        {
          stage: "Vegetative Growth",
          time: "20–30 days",
          action: "Give split nitrogen and micronutrient support.",
          perAcre: "Need-based dose",
          total: "Adjust based on crop condition",
          reason: "Supports plant growth and flowering.",
        },
        {
          stage: "Flowering & Fruiting",
          time: "45 days onward",
          action: "Focus on potash, calcium and fruit borer monitoring.",
          perAcre: "Need-based potash and calcium",
          total: "Use based on crop load",
          reason: "Improves fruit size, quality and shelf life.",
        },
      ],
      pests: [
        {
          name: "Leaf Curl / Whitefly",
          action: "Use yellow sticky traps and remove infected plants early.",
        },
        {
          name: "Fruit Borer",
          action: "Use pheromone traps and check fruits regularly.",
        },
        {
          name: "Early Blight",
          action: "Avoid wet leaves and remove infected leaves.",
        },
      ],
      tips: [
        "Use staking to keep fruits away from soil.",
        "Avoid irregular watering to reduce fruit cracking.",
        "Check fruits every 2–3 days after fruiting starts.",
      ],
    };
  }

  if (crop.includes("chilli")) {
    return {
      duration: 5,
      shortAdvice:
        "Chilli needs pest monitoring, balanced water and potash support during flowering.",
      stages: [
        {
          stage: "Land Preparation",
          time: "Before planting",
          action: "Apply FYM and basal fertilizer.",
          perAcre: "6–8 tons FYM",
          total: amount(7, "tons FYM"),
          reason: "Supports root growth and soil health.",
        },
        {
          stage: "Vegetative Growth",
          time: "20–40 days",
          action: "Monitor thrips, mites and leaf curl.",
          perAcre: "Use sticky traps",
          total: "Use need-based spray only",
          reason: "Reduces sucking pest damage.",
        },
        {
          stage: "Flowering & Harvest",
          time: "50 days onward",
          action: "Support potash and fruit quality.",
          perAcre: "Need-based potash",
          total: "Adjust based on plant condition",
          reason: "Improves chilli quality and yield.",
        },
      ],
      pests: [
        {
          name: "Thrips",
          action: "Check leaf curling and silvering symptoms.",
        },
        {
          name: "Mites",
          action: "Check small leaves and leaf bronzing.",
        },
        {
          name: "Fruit Rot",
          action: "Avoid water stagnation and remove affected fruits.",
        },
      ],
      tips: [
        "Use yellow/blue sticky traps.",
        "Avoid repeated use of the same pesticide.",
        "Harvest regularly for better fruit quality.",
      ],
    };
  }

  return {
    duration: 4,
    shortAdvice:
      "Use soil-test based fertilizer and monitor crop health every week.",
    stages: [
      {
        stage: "Land Preparation",
        time: "Before sowing",
        action: "Apply organic manure and prepare drainage.",
        perAcre: "5–8 tons FYM",
        total: amount(6, "tons FYM"),
        reason: "Improves soil structure and early crop growth.",
      },
      {
        stage: "Early Growth",
        time: "15–30 days",
        action: "Apply crop-specific fertilizer based on soil test.",
        perAcre: "Soil-test based dose",
        total: "Adjust by local recommendation",
        reason: "Reduces fertilizer waste and saves cost.",
      },
      {
        stage: "Pest Monitoring",
        time: "Weekly",
        action: "Check leaves, stems, flowers and fruits.",
        perAcre: "Use traps/scouting first",
        total: "Spray only when needed",
        reason: "Reduces pesticide cost and protects crop quality.",
      },
      {
        stage: "Market Planning",
        time: "Before harvest",
        action: "Compare mandi prices and arrange transport.",
        perAcre: "Plan grading and packing",
        total: "Contact buyer before harvest",
        reason: "Helps farmer sell at better price.",
      },
    ],
    pests: [
      {
        name: "Leaf Damage",
        action: "Check weekly for spots, holes and curling.",
      },
      {
        name: "Stem / Root Problems",
        action: "Check wilting and waterlogging symptoms.",
      },
      {
        name: "Fruit / Grain Damage",
        action: "Inspect before harvest and separate damaged produce.",
      },
    ],
    tips: [
      "Use soil-test based fertilizer when possible.",
      "Avoid unnecessary pesticide spraying.",
      "Check market price before harvest.",
    ],
  };
}

function formatAmount(value) {
  const num = Number(value || 0);
  return Number.isInteger(num) ? num : num.toFixed(2);
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block font-black text-slate-700 mb-2">{label}</label>
      {children}
    </div>
  );
}

function HeroMetric({ title, value }) {
  return (
    <div className="bg-white text-slate-900 rounded-3xl p-5">
      <p className="text-slate-500 font-bold">{title}</p>
      <h3 className="text-2xl font-black text-green-700 mt-1">{value}</h3>
    </div>
  );
}

function SummaryCard({ title, value, danger }) {
  return (
    <div className="bg-slate-50 rounded-3xl p-5">
      <p className="text-slate-500 font-bold">{title}</p>
      <h3
        className={`text-2xl font-black mt-1 ${
          danger ? "text-red-600" : "text-green-700"
        }`}
      >
        {value}
      </h3>
    </div>
  );
}

function MiniInfo({ label, value }) {
  return (
    <div className="bg-white rounded-2xl p-3">
      <p className="text-xs text-slate-500 font-bold">{label}</p>
      <p className="text-sm font-black text-slate-900 mt-1">{value}</p>
    </div>
  );
}

export default UploadCrop;