import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const TEXT = {
  en: {
    title: "Crop Combination Planner",
    subtitle: "Plan 2 or 3 crops together with acre division and risk guidance",
    dashboard: "Dashboard",
    knowledge: "Crop Knowledge",
    languageButton: "తెలుగు",
    heroSmall: "Multi-Crop Planning",
    heroTitle: "Choose 2 or 3 crops and divide your land smartly",
    heroDesc:
      "This planner helps farmers decide how many acres to give for each crop, which crops support each other, and what risks to watch before planting.",
    totalAcres: "Total Acres",
    crop1: "Main Crop",
    crop2: "Second Crop",
    crop3: "Third Crop",
    optional: "Optional",
    chooseCrop: "Choose crop",
    selectPlan: "Select Acre Plan",
    balanced: "Balanced",
    mainCropFocus: "Main Crop Focus",
    marketFocus: "Market Focus",
    soilFocus: "Soil Health Focus",
    custom: "Custom",
    acreDivision: "Acre Division Plan",
    selectedCrops: "Selected Crops",
    crop: "Crop",
    acres: "Acres",
    percent: "Percent",
    reason: "Reason",
    duration: "Duration",
    water: "Water",
    compatibility: "Compatibility Explanation",
    fieldLayout: "Suggested Field Layout",
    advancedPlan: "Advanced Farming Plan",
    healthRisk: "Health & Disease Risk",
    marketPlan: "Market Planning",
    farmerNote: "Farmer Note",
    noCrop:
      "Select at least 2 crops and enter acres to generate a combination plan.",
    advisory:
      "This is a planning guide. Final crop selection should depend on soil test, irrigation, local weather, market demand and agriculture officer/KVK advice.",
    print: "Print Plan",
  },

  te: {
    title: "పంటల కలయిక ప్రణాళిక",
    subtitle: "2 లేదా 3 పంటలను కలిపి ఎకరాల విభజనతో ప్లాన్ చేయండి",
    dashboard: "డ్యాష్‌బోర్డ్",
    knowledge: "పంట జ్ఞానం",
    languageButton: "English",
    heroSmall: "బహుళ పంటల ప్రణాళిక",
    heroTitle: "2 లేదా 3 పంటలు ఎంచుకుని భూమిని తెలివిగా విభజించండి",
    heroDesc:
      "ఈ పేజీ రైతుకు ఏ పంటకు ఎన్ని ఎకరాలు ఇవ్వాలి, ఏ పంటలు కలిపి వేయవచ్చు, ఏ ప్రమాదాలు ఉంటాయి అనేది సులభంగా చూపిస్తుంది.",
    totalAcres: "మొత్తం ఎకరాలు",
    crop1: "ముఖ్య పంట",
    crop2: "రెండో పంట",
    crop3: "మూడో పంట",
    optional: "ఐచ్చికం",
    chooseCrop: "పంట ఎంచుకోండి",
    selectPlan: "ఎకరాల ప్లాన్ ఎంచుకోండి",
    balanced: "సమతుల్య ప్లాన్",
    mainCropFocus: "ముఖ్య పంటకు ఎక్కువ భూమి",
    marketFocus: "మార్కెట్ ఆదాయం ఫోకస్",
    soilFocus: "మట్టి ఆరోగ్యం ఫోకస్",
    custom: "కస్టమ్",
    acreDivision: "ఎకరాల విభజన ప్రణాళిక",
    selectedCrops: "ఎంచుకున్న పంటలు",
    crop: "పంట",
    acres: "ఎకరాలు",
    percent: "శాతం",
    reason: "కారణం",
    duration: "కాలం",
    water: "నీరు",
    compatibility: "అనుకూలత వివరణ",
    fieldLayout: "పొలం విభజన సూచన",
    advancedPlan: "ఆధునిక వ్యవసాయ ప్రణాళిక",
    healthRisk: "ఆరోగ్యం & వ్యాధి ప్రమాదం",
    marketPlan: "మార్కెట్ ప్రణాళిక",
    farmerNote: "రైతు గమనిక",
    noCrop:
      "ప్లాన్ కోసం కనీసం 2 పంటలు ఎంచుకుని మొత్తం ఎకరాలు నమోదు చేయండి.",
    advisory:
      "ఇది ప్రణాళిక గైడ్ మాత్రమే. తుది పంట ఎంపిక మట్టి పరీక్ష, నీటి లభ్యత, స్థానిక వాతావరణం, మార్కెట్ డిమాండ్ మరియు వ్యవసాయ అధికారి/KVK సూచనలపై ఆధారపడి ఉండాలి.",
    print: "ప్లాన్ ప్రింట్ చేయండి",
  },
};

const CROPS = [
  {
    id: "rice",
    en: "Rice",
    te: "వరి",
    icon: "🌾",
    family: "Cereal",
    season: "Kharif / Rabi",
    duration: "5–6 months",
    water: "High",
    soil: "Clay / loamy soil",
    priority: "food",
  },
  {
    id: "paddy",
    en: "Paddy",
    te: "ప్యాడీ",
    icon: "🌾",
    family: "Cereal",
    season: "Kharif / Rabi",
    duration: "5–6 months",
    water: "High",
    soil: "Clay soil",
    priority: "food",
  },
  {
    id: "maize",
    en: "Maize",
    te: "మొక్కజొన్న",
    icon: "🌽",
    family: "Cereal",
    season: "Kharif / Rabi",
    duration: "3–4 months",
    water: "Medium",
    soil: "Well-drained soil",
    priority: "market",
  },
  {
    id: "wheat",
    en: "Wheat",
    te: "గోధుమ",
    icon: "🌾",
    family: "Cereal",
    season: "Rabi",
    duration: "4 months",
    water: "Medium",
    soil: "Loamy soil",
    priority: "food",
  },
  {
    id: "jowar",
    en: "Jowar",
    te: "జొన్న",
    icon: "🌾",
    family: "Millet",
    season: "Kharif / Rabi",
    duration: "3–4 months",
    water: "Low",
    soil: "Dryland soil",
    priority: "dryland",
  },
  {
    id: "bajra",
    en: "Bajra",
    te: "సజ్జ",
    icon: "🌾",
    family: "Millet",
    season: "Kharif",
    duration: "3–4 months",
    water: "Low",
    soil: "Sandy loam",
    priority: "dryland",
  },
  {
    id: "tomato",
    en: "Tomato",
    te: "టమోటా",
    icon: "🍅",
    family: "Vegetable",
    season: "All seasons with care",
    duration: "3–4 months",
    water: "Medium",
    soil: "Well-drained loamy soil",
    priority: "market",
  },
  {
    id: "chilli",
    en: "Chilli",
    te: "మిర్చి",
    icon: "🌶️",
    family: "Spice",
    season: "Kharif / Rabi",
    duration: "5–6 months",
    water: "Medium",
    soil: "Well-drained soil",
    priority: "market",
  },
  {
    id: "onion",
    en: "Onion",
    te: "ఉల్లి",
    icon: "🧅",
    family: "Vegetable",
    season: "Rabi / Kharif",
    duration: "4–5 months",
    water: "Medium",
    soil: "Loose fertile soil",
    priority: "market",
  },
  {
    id: "potato",
    en: "Potato",
    te: "బంగాళాదుంప",
    icon: "🥔",
    family: "Vegetable",
    season: "Rabi",
    duration: "3–4 months",
    water: "Medium",
    soil: "Loose well-drained soil",
    priority: "market",
  },
  {
    id: "brinjal",
    en: "Brinjal",
    te: "వంకాయ",
    icon: "🍆",
    family: "Vegetable",
    season: "All seasons",
    duration: "4–5 months",
    water: "Medium",
    soil: "Loamy soil",
    priority: "market",
  },
  {
    id: "okra",
    en: "Okra",
    te: "బెండకాయ",
    icon: "🌿",
    family: "Vegetable",
    season: "Summer / Kharif",
    duration: "3–4 months",
    water: "Medium",
    soil: "Well-drained soil",
    priority: "market",
  },
  {
    id: "cotton",
    en: "Cotton",
    te: "పత్తి",
    icon: "☁️",
    family: "Commercial",
    season: "Kharif",
    duration: "5–6 months",
    water: "Medium",
    soil: "Black cotton soil",
    priority: "market",
  },
  {
    id: "sugarcane",
    en: "Sugarcane",
    te: "చెరకు",
    icon: "🎋",
    family: "Commercial",
    season: "Long duration",
    duration: "10–12 months",
    water: "High",
    soil: "Deep fertile soil",
    priority: "market",
  },
  {
    id: "turmeric",
    en: "Turmeric",
    te: "పసుపు",
    icon: "🟡",
    family: "Spice",
    season: "Kharif",
    duration: "8–9 months",
    water: "Medium",
    soil: "Well-drained fertile soil",
    priority: "market",
  },
  {
    id: "ginger",
    en: "Ginger",
    te: "అల్లం",
    icon: "🫚",
    family: "Spice",
    season: "Kharif",
    duration: "8–9 months",
    water: "Medium",
    soil: "Loose fertile soil",
    priority: "market",
  },
  {
    id: "garlic",
    en: "Garlic",
    te: "వెల్లుల్లి",
    icon: "🧄",
    family: "Spice",
    season: "Rabi",
    duration: "4–5 months",
    water: "Medium",
    soil: "Loose fertile soil",
    priority: "market",
  },
  {
    id: "groundnut",
    en: "Groundnut",
    te: "వేరుశెనగ",
    icon: "🥜",
    family: "Oilseed",
    season: "Kharif / Rabi",
    duration: "3–4 months",
    water: "Low-Medium",
    soil: "Sandy loam",
    priority: "soil",
  },
  {
    id: "sunflower",
    en: "Sunflower",
    te: "సూర్యకాంతి",
    icon: "🌻",
    family: "Oilseed",
    season: "Rabi / Summer",
    duration: "3–4 months",
    water: "Low-Medium",
    soil: "Well-drained soil",
    priority: "soil",
  },
  {
    id: "mustard",
    en: "Mustard",
    te: "ఆవాలు",
    icon: "🌼",
    family: "Oilseed",
    season: "Rabi",
    duration: "3–4 months",
    water: "Low",
    soil: "Loamy soil",
    priority: "soil",
  },
  {
    id: "sesame",
    en: "Sesame",
    te: "నువ్వులు",
    icon: "🌱",
    family: "Oilseed",
    season: "Kharif / Summer",
    duration: "3 months",
    water: "Low",
    soil: "Light soil",
    priority: "soil",
  },
  {
    id: "redgram",
    en: "Red Gram",
    te: "కందులు",
    icon: "🫘",
    family: "Pulse",
    season: "Kharif",
    duration: "5–7 months",
    water: "Low-Medium",
    soil: "Well-drained soil",
    priority: "soil",
  },
  {
    id: "greengram",
    en: "Green Gram",
    te: "పెసర",
    icon: "🫘",
    family: "Pulse",
    season: "Kharif / Summer",
    duration: "2–3 months",
    water: "Low",
    soil: "Light soil",
    priority: "soil",
  },
  {
    id: "blackgram",
    en: "Black Gram",
    te: "మినుము",
    icon: "🫘",
    family: "Pulse",
    season: "Kharif / Rabi",
    duration: "2–3 months",
    water: "Low",
    soil: "Well-drained soil",
    priority: "soil",
  },
  {
    id: "bengalgram",
    en: "Bengal Gram",
    te: "సెనగ",
    icon: "🫘",
    family: "Pulse",
    season: "Rabi",
    duration: "3–4 months",
    water: "Low",
    soil: "Black soil / loamy soil",
    priority: "soil",
  },
  {
    id: "banana",
    en: "Banana",
    te: "అరటి",
    icon: "🍌",
    family: "Fruit",
    season: "All seasons with irrigation",
    duration: "10–12 months",
    water: "High",
    soil: "Deep fertile soil",
    priority: "market",
  },
  {
    id: "mango",
    en: "Mango",
    te: "మామిడి",
    icon: "🥭",
    family: "Fruit",
    season: "Long-term orchard",
    duration: "Perennial",
    water: "Low-Medium",
    soil: "Well-drained soil",
    priority: "longterm",
  },
  {
    id: "papaya",
    en: "Papaya",
    te: "బొప్పాయి",
    icon: "🍈",
    family: "Fruit",
    season: "All seasons",
    duration: "8–10 months",
    water: "Medium",
    soil: "Well-drained soil",
    priority: "market",
  },
  {
    id: "watermelon",
    en: "Watermelon",
    te: "పుచ్చకాయ",
    icon: "🍉",
    family: "Fruit",
    season: "Summer",
    duration: "3 months",
    water: "Medium",
    soil: "Sandy loam",
    priority: "market",
  },
];

function CropCombinationPlanner() {
  const navigate = useNavigate();
  const location = useLocation();

  const [lang, setLang] = useState(localStorage.getItem("appLang") || "en");
  const t = TEXT[lang];

  const [totalAcres, setTotalAcres] = useState(3);
  const [planType, setPlanType] = useState("balanced");

  const [crop1, setCrop1] = useState(location.state?.crop1 || "rice");
  const [crop2, setCrop2] = useState(location.state?.crop2 || "greengram");
  const [crop3, setCrop3] = useState(location.state?.crop3 || "");

  const [custom, setCustom] = useState({
    crop1: 50,
    crop2: 30,
    crop3: 20,
  });

  const selectedCrops = useMemo(() => {
    return [crop1, crop2, crop3]
      .filter(Boolean)
      .map((id) => CROPS.find((crop) => crop.id === id))
      .filter(Boolean);
  }, [crop1, crop2, crop3]);

  const plan = useMemo(() => {
    return buildAcrePlan(
      selectedCrops,
      Number(totalAcres || 0),
      planType,
      custom,
      lang
    );
  }, [selectedCrops, totalAcres, planType, custom, lang]);

  const changeLanguage = () => {
    const nextLang = lang === "en" ? "te" : "en";
    setLang(nextLang);
    localStorage.setItem("appLang", nextLang);
  };

  const label = (crop) => {
    if (!crop) return "";
    return lang === "te" ? crop.te : crop.en;
  };

  return (
    <div className="min-h-screen bg-[#f4f8f5] text-slate-900">
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-[88px] flex items-center justify-between">
          <div
            className="flex items-center gap-4 cursor-pointer"
            onClick={() => navigate("/dashboard")}
          >
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-green-600 to-emerald-400 flex items-center justify-center shadow-lg">
              <span className="text-3xl">🌱</span>
            </div>

            <div>
              <h1 className="text-3xl font-black tracking-tight">
                {t.title}
              </h1>
              <p className="text-sm text-slate-500">{t.subtitle}</p>
            </div>
          </div>

          <div className="hidden md:flex gap-3">
            <button
              onClick={changeLanguage}
              className="bg-orange-100 text-orange-700 px-5 py-3 rounded-xl font-bold"
            >
              {t.languageButton}
            </button>

            <button
              onClick={() => navigate("/crop-knowledge")}
              className="bg-slate-100 text-slate-800 px-5 py-3 rounded-xl font-bold"
            >
              {t.knowledge}
            </button>

            <button
              onClick={() => navigate("/dashboard")}
              className="bg-green-600 text-white px-5 py-3 rounded-xl font-bold"
            >
              {t.dashboard}
            </button>
          </div>
        </div>
      </nav>

      <section className="bg-gradient-to-br from-green-950 via-green-800 to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-[1fr_0.9fr] gap-10 items-center">
          <div>
            <p className="font-bold text-green-100 mb-4">{t.heroSmall}</p>

            <h2 className="text-5xl lg:text-6xl font-black leading-tight">
              {t.heroTitle}
            </h2>

            <p className="text-green-50 text-lg leading-8 mt-6">
              {t.heroDesc}
            </p>

            <button
              onClick={() => window.print()}
              className="bg-white text-green-700 px-7 py-4 rounded-2xl font-black mt-8"
            >
              {t.print}
            </button>
          </div>

          <div className="bg-white/15 border border-white/20 backdrop-blur rounded-[2rem] p-6">
            <div className="grid md:grid-cols-2 gap-4">
              <Field label={t.totalAcres}>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={totalAcres}
                  onChange={(e) => setTotalAcres(e.target.value)}
                  className="select-input"
                />
              </Field>

              <Field label={t.selectPlan}>
                <select
                  value={planType}
                  onChange={(e) => setPlanType(e.target.value)}
                  className="select-input"
                >
                  <option value="balanced">{t.balanced}</option>
                  <option value="main">{t.mainCropFocus}</option>
                  <option value="market">{t.marketFocus}</option>
                  <option value="soil">{t.soilFocus}</option>
                  <option value="custom">{t.custom}</option>
                </select>
              </Field>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mt-5">
              <CropSelect
                label={t.crop1}
                value={crop1}
                setValue={setCrop1}
                lang={lang}
              />

              <CropSelect
                label={t.crop2}
                value={crop2}
                setValue={setCrop2}
                lang={lang}
              />

              <CropSelect
                label={`${t.crop3} (${t.optional})`}
                value={crop3}
                setValue={setCrop3}
                lang={lang}
                optional
              />
            </div>

            {planType === "custom" && (
              <div className="grid md:grid-cols-3 gap-4 mt-5">
                <CustomPercent
                  label={`${t.crop1} %`}
                  value={custom.crop1}
                  onChange={(value) =>
                    setCustom((prev) => ({ ...prev, crop1: value }))
                  }
                />

                <CustomPercent
                  label={`${t.crop2} %`}
                  value={custom.crop2}
                  onChange={(value) =>
                    setCustom((prev) => ({ ...prev, crop2: value }))
                  }
                />

                <CustomPercent
                  label={`${t.crop3} %`}
                  value={custom.crop3}
                  onChange={(value) =>
                    setCustom((prev) => ({ ...prev, crop3: value }))
                  }
                />
              </div>
            )}
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {selectedCrops.length < 2 || Number(totalAcres || 0) <= 0 ? (
          <div className="bg-white rounded-[2rem] shadow-xl p-10 text-center font-bold text-slate-600">
            {t.noCrop}
          </div>
        ) : (
          <>
            <section className="grid md:grid-cols-4 gap-6 -mt-20 relative z-10">
              <Metric title={t.totalAcres} value={`${totalAcres} ${t.acres}`} />
              <Metric title={t.selectedCrops} value={selectedCrops.length} />
              <Metric title={t.compatibility} value={plan.scoreLabel} />
              <Metric title={t.water} value={plan.waterRisk} />
            </section>

            <section className="bg-white rounded-[2rem] shadow-xl border border-slate-100 p-8 mt-8">
              <h3 className="text-3xl font-black text-slate-900">
                {t.acreDivision}
              </h3>

              <div className="overflow-x-auto mt-8">
                <table className="w-full min-w-[1000px]">
                  <thead className="bg-slate-900 text-white text-left">
                    <tr>
                      <th className="p-5">{t.crop}</th>
                      <th className="p-5">{t.acres}</th>
                      <th className="p-5">{t.percent}</th>
                      <th className="p-5">{t.duration}</th>
                      <th className="p-5">{t.water}</th>
                      <th className="p-5">{t.reason}</th>
                    </tr>
                  </thead>

                  <tbody>
                    {plan.rows.map((row) => (
                      <tr
                        key={row.crop.id}
                        className="border-b hover:bg-green-50"
                      >
                        <td className="p-5">
                          <b className="text-green-700">
                            {row.crop.icon} {label(row.crop)}
                          </b>
                          <p className="text-sm text-slate-500">
                            {row.crop.family}
                          </p>
                        </td>
                        <td className="p-5 font-black">
                          {row.acres.toFixed(2)}
                        </td>
                        <td className="p-5">{row.percent}%</td>
                        <td className="p-5">{row.crop.duration}</td>
                        <td className="p-5">{row.crop.water}</td>
                        <td className="p-5 text-slate-600">{row.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8 mt-8">
              <InfoPanel title={t.compatibility} items={plan.compatibility} />
              <InfoPanel title={t.fieldLayout} items={plan.layout} />
            </section>

            <section className="grid lg:grid-cols-3 gap-8 mt-8">
              <InfoPanel title={t.advancedPlan} items={plan.advanced} dark />
              <InfoPanel title={t.healthRisk} items={plan.health} />
              <InfoPanel title={t.marketPlan} items={plan.market} />
            </section>

            <section className="bg-amber-50 border border-amber-200 text-amber-900 rounded-[2rem] p-8 mt-8">
              <h3 className="text-2xl font-black">{t.farmerNote}</h3>
              <p className="leading-8 mt-3 font-semibold">{t.advisory}</p>
            </section>
          </>
        )}
      </main>

      <style>{`
        .select-input {
          width: 100%;
          border-radius: 1rem;
          padding: 0.95rem 1rem;
          color: #0f172a;
          font-weight: 800;
          outline: none;
          background: white;
        }
      `}</style>
    </div>
  );
}

function buildAcrePlan(crops, totalAcres, planType, custom, lang) {
  const isTe = lang === "te";
  const count = crops.length;

  let percents = [];

  if (planType === "main") {
    percents = count === 2 ? [70, 30] : [60, 25, 15];
  } else if (planType === "market") {
    percents = getPriorityPercents(crops, "market", count);
  } else if (planType === "soil") {
    percents = getPriorityPercents(crops, "soil", count);
  } else if (planType === "custom") {
    percents =
      count === 2
        ? [Number(custom.crop1), Number(custom.crop2)]
        : [Number(custom.crop1), Number(custom.crop2), Number(custom.crop3)];

    const sum = percents.reduce((a, b) => a + b, 0) || 100;
    percents = percents.map((p) => Math.round((p / sum) * 100));
  } else {
    percents = count === 2 ? [60, 40] : [50, 30, 20];
  }

  const rows = crops.map((crop, index) => {
    const percent = percents[index] || 0;
    const acres = (totalAcres * percent) / 100;

    return {
      crop,
      percent,
      acres,
      reason: getCropReason(crop, index, isTe),
    };
  });

  const hasHighWater = crops.some((crop) =>
    crop.water.toLowerCase().includes("high")
  );
  const hasLowWater = crops.some((crop) =>
    crop.water.toLowerCase().includes("low")
  );
  const sameFamilyCount = new Set(crops.map((crop) => crop.family)).size;

  let scoreLabel = isTe ? "మంచి ప్లాన్" : "Good Plan";

  if (hasHighWater && hasLowWater) {
    scoreLabel = isTe ? "జాగ్రత్త అవసరం" : "Needs Care";
  }

  if (sameFamilyCount === 1) {
    scoreLabel = isTe ? "వ్యాధి ప్రమాదం ఎక్కువ" : "Higher Disease Risk";
  }

  return {
    rows,
    scoreLabel,
    waterRisk:
      hasHighWater && hasLowWater
        ? isTe
          ? "నీటి అవసరం వేర్వేరు"
          : "Different water needs"
        : isTe
        ? "నీటి ప్లాన్ సులభం"
        : "Water plan manageable",

    compatibility: getCompatibilityText(crops, isTe),
    layout: getLayoutText(rows, isTe),
    advanced: getAdvancedText(isTe),
    health: getHealthText(isTe),
    market: getMarketText(crops, isTe),
  };
}

function getPriorityPercents(crops, priority, count) {
  const sorted = [...crops].sort((a, b) => {
    if (a.priority === priority && b.priority !== priority) return -1;
    if (a.priority !== priority && b.priority === priority) return 1;
    return 0;
  });

  const base = count === 2 ? [65, 35] : [55, 30, 15];

  return crops.map((crop) => {
    const index = sorted.findIndex((item) => item.id === crop.id);
    return base[index] || 10;
  });
}

function getCropReason(crop, index, isTe) {
  if (index === 0) {
    return isTe
      ? "ఇది ప్రధాన పంట. ఎక్కువ భూమి ఇస్తే ప్రధాన ఆదాయం దీనినుంచి వస్తుంది."
      : "This is the main crop. More land gives primary income from this crop.";
  }

  if (crop.family === "Pulse") {
    return isTe
      ? "పప్పు పంట మట్టి ఆరోగ్యానికి మంచిది. నైట్రోజన్ మెరుగుపడుతుంది."
      : "Pulse crop supports soil health and improves nitrogen.";
  }

  if (crop.priority === "market") {
    return isTe
      ? "మార్కెట్ ధర బాగుంటే అదనపు ఆదాయం ఇవ్వగలదు."
      : "Can give extra income when market price is good.";
  }

  return isTe
    ? "పంట వైవిధ్యం వల్ల ప్రమాదం తగ్గుతుంది."
    : "Crop diversity reduces risk.";
}

function getCompatibilityText(crops, isTe) {
  const families = new Set(crops.map((crop) => crop.family));
  const hasPulse = crops.some((crop) => crop.family === "Pulse");
  const hasRice = crops.some(
    (crop) => crop.id === "rice" || crop.id === "paddy"
  );
  const hasVegetable = crops.some((crop) => crop.family === "Vegetable");

  const points = [];

  if (hasRice) {
    points.push(
      isTe
        ? "వరి నీరు నిల్వ ఉండే పంట. పప్పు లేదా నువ్వులు లాంటి పంటలు వరి తర్వాత పంట మార్పిడిగా మంచివి."
        : "Rice needs standing water. Pulses or sesame are better after rice as rotation, not inside standing water."
    );
  }

  if (hasPulse) {
    points.push(
      isTe
        ? "పప్పు పంటలు మట్టిలో నైట్రోజన్ పెంచి తర్వాత పంటకు సహాయపడతాయి."
        : "Pulse crops improve soil nitrogen and help the next crop."
    );
  }

  if (hasVegetable) {
    points.push(
      isTe
        ? "కూరగాయల పంటలకు నీరు, మార్కెట్ ధర మరియు తరచూ పర్యవేక్షణ అవసరం."
        : "Vegetable crops need regular water, market tracking and frequent monitoring."
    );
  }

  if (families.size === 1) {
    points.push(
      isTe
        ? "అన్నీ ఒకే కుటుంబానికి చెందిన పంటలైతే వ్యాధి ప్రమాదం పెరుగుతుంది. పంట మార్పిడి మంచిది."
        : "Same-family crops can increase disease risk. Use crop rotation."
    );
  } else {
    points.push(
      isTe
        ? "వేర్వేరు కుటుంబాల పంటలు ఉండటం వల్ల పురుగు/వ్యాధి చక్రం తగ్గుతుంది."
        : "Different crop families help reduce pest and disease cycle."
    );
  }

  return points;
}

function getLayoutText(rows, isTe) {
  return rows.map((row, index) => {
    const cropName = isTe ? row.crop.te : row.crop.en;

    if (index === 0) {
      return isTe
        ? `${row.crop.icon} ${cropName}: పొలంలో ప్రధాన భాగం ${row.acres.toFixed(
            2
          )} ఎకరాలు ఇవ్వండి.`
        : `${row.crop.icon} ${cropName}: Keep main block of ${row.acres.toFixed(
            2
          )} acres.`;
    }

    return isTe
      ? `${row.crop.icon} ${cropName}: గట్లు, అంచులు లేదా వేరు బ్లాక్‌లో ${row.acres.toFixed(
          2
        )} ఎకరాలు ప్లాన్ చేయండి.`
      : `${row.crop.icon} ${cropName}: Plan ${row.acres.toFixed(
          2
        )} acres on borders, bunds or separate block.`;
  });
}

function getAdvancedText(isTe) {
  return isTe
    ? [
        "మొదటి సంవత్సరం మొత్తం భూమిపై ప్రయోగం చేయకుండా చిన్న భాగంలో 2/3 పంటల ప్లాన్ పరీక్షించండి.",
        "నీటి అవసరం వేర్వేరు పంటలను వేరు బ్లాక్‌లుగా ఉంచండి.",
        "డ్రిప్ లేదా మల్చింగ్ వాడితే నీరు ఆదా అవుతుంది మరియు కలుపు తగ్గుతుంది.",
        "కోత సమయం ఒకేసారి రాకుండా పంటలను ఎంచుకుంటే కార్మిక ఖర్చు మరియు మార్కెట్ ఒత్తిడి తగ్గుతుంది.",
      ]
    : [
        "Do not test a new 2/3 crop combination on full land in the first year. Try on smaller area first.",
        "Keep crops with different water needs in separate blocks.",
        "Use drip or mulching where possible to save water and reduce weeds.",
        "Choose crops with different harvest windows to reduce labour pressure and market risk.",
      ];
}

function getHealthText(isTe) {
  return isTe
    ? [
        "ఒకే కుటుంబం పంటలను వరుసగా వేయడం వల్ల మట్టిలో వ్యాధులు పెరుగుతాయి.",
        "కూరగాయల పంటలలో సక్కింగ్ పెస్ట్స్ ఎక్కువగా ఉంటాయి. స్టికీ ట్రాప్స్ వాడండి.",
        "పొలం నీరు నిల్వ ఉండకుండా డ్రైనేజ్ ఏర్పాటు చేస్తే రూట్ రాట్ తగ్గుతుంది.",
        "అవసరం లేకుండా పురుగుమందులు వాడవద్దు. ముందుగా లక్షణాలు గమనించండి.",
      ]
    : [
        "Repeating same-family crops can increase soil-borne diseases.",
        "Vegetables often face sucking pests. Use sticky traps for monitoring.",
        "Good drainage reduces root rot and wilt problems.",
        "Do not spray pesticides unnecessarily. First observe pest symptoms.",
      ];
}

function getMarketText(crops, isTe) {
  return crops.map((crop) =>
    isTe
      ? `${crop.icon} ${crop.te}: కోతకు 10–15 రోజుల ముందు మండీ ధర మరియు కొనుగోలుదారుల డిమాండ్ చెక్ చేయండి.`
      : `${crop.icon} ${crop.en}: Check mandi price and buyer demand 10–15 days before harvest.`
  );
}

function CropSelect({ label, value, setValue, lang, optional }) {
  return (
    <Field label={label}>
      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="select-input"
      >
        {optional && (
          <option value="">{lang === "te" ? "ఎంపిక లేదు" : "None"}</option>
        )}

        {!optional && (
          <option value="">
            {lang === "te" ? "పంట ఎంచుకోండి" : "Choose crop"}
          </option>
        )}

        {CROPS.map((crop) => (
          <option key={crop.id} value={crop.id}>
            {crop.icon} {lang === "te" ? crop.te : crop.en}
          </option>
        ))}
      </select>
    </Field>
  );
}

function CustomPercent({ label, value, onChange }) {
  return (
    <Field label={label}>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="select-input"
      />
    </Field>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block font-black text-white mb-2">{label}</label>
      {children}
    </div>
  );
}

function Metric({ title, value }) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100">
      <p className="text-slate-500 font-bold">{title}</p>
      <h3 className="text-2xl font-black text-green-700 mt-2">{value}</h3>
    </div>
  );
}

function InfoPanel({ title, items, dark }) {
  return (
    <div
      className={`rounded-[2rem] shadow-xl p-8 ${
        dark ? "bg-slate-900 text-white" : "bg-white border border-slate-100"
      }`}
    >
      <h3 className="text-3xl font-black">{title}</h3>

      <div className="space-y-4 mt-6">
        {items.map((item, index) => (
          <div
            key={index}
            className={`rounded-3xl p-5 ${
              dark ? "bg-white/10" : "bg-slate-50 border border-slate-100"
            }`}
          >
            <p
              className={`font-semibold leading-7 ${
                dark ? "text-slate-200" : "text-slate-700"
              }`}
            >
              {item}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CropCombinationPlanner;