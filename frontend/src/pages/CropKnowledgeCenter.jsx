import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const TEXT = {
  en: {
    pageTitle: "Crop Knowledge Center",
    subtitle: "Complete crop process, health issues and advanced farming plans",
    backDashboard: "Dashboard",
    myCrops: "My Crops",
    languageButton: "తెలుగు",
    heroSmall: "Smart Farming Guide",
    heroTitle: "Choose a crop and get complete start-to-end farming guidance",
    heroDesc:
      "This page explains crop process, nutrient timing, pest and disease prevention, 2/3 crop planning and advanced farming practices in simple farmer-friendly language.",
    selectPrimary: "Select Main Crop",
    selectSecond: "Select 2nd Crop",
    selectThird: "Select 3rd Crop",
    optional: "Optional",
    print: "Print Guide",
    cropProfile: "Crop Profile",
    cropProcess: "Crop Process: Start to End",
    healthIssues: "Health Issues & How to Reduce Disease",
    relatedCrops: "2 / 3 Crop Planning",
    advancedPlan: "Advanced Farming Plan",
    farmerNote: "Farmer Note",
    duration: "Duration",
    season: "Season",
    water: "Water Need",
    soil: "Soil",
    category: "Category",
    stage: "Stage",
    timing: "Timing",
    whatToDo: "What to do",
    why: "Why it matters",
    symptoms: "Symptoms",
    reduce: "How to reduce",
    selectedCrops: "Selected Crops",
    compatibility: "Compatibility",
    suggestions: "Suggestions",
    openPlanning: "Open Related Crop Planning",
    openPlanningDesc:
      "Selected crops will open in Crop Combination Planner. There farmer can enter total acres and see how to divide land crop-wise.",
    advisory:
      "This is a general farming guide. Final fertilizer, pesticide and crop decisions should be adjusted based on soil test, local weather, crop variety, pest level and local agriculture officer/KVK advice.",
    noCrop: "Please select a crop to view guidance.",
  },

  te: {
    pageTitle: "పంట జ్ఞాన కేంద్రం",
    subtitle: "పంట ప్రారంభం నుండి చివరి వరకు పూర్తి గైడ్",
    backDashboard: "డ్యాష్‌బోర్డ్",
    myCrops: "నా పంటలు",
    languageButton: "English",
    heroSmall: "స్మార్ట్ వ్యవసాయ గైడ్",
    heroTitle: "పంటను ఎంచుకోండి, ప్రారంభం నుండి చివరి వరకు గైడ్ పొందండి",
    heroDesc:
      "ఈ పేజీలో పంట దశలు, ఎరువుల సమయం, పురుగు/వ్యాధి నివారణ, 2/3 పంటల ప్రణాళిక మరియు ఆధునిక వ్యవసాయ పద్ధతులు రైతుకు అర్థమయ్యేలా చూపిస్తాం.",
    selectPrimary: "ముఖ్య పంట ఎంచుకోండి",
    selectSecond: "2వ పంట ఎంచుకోండి",
    selectThird: "3వ పంట ఎంచుకోండి",
    optional: "ఐచ్చికం",
    print: "గైడ్ ప్రింట్ చేయండి",
    cropProfile: "పంట వివరాలు",
    cropProcess: "పంట ప్రక్రియ: ప్రారంభం నుండి చివరి వరకు",
    healthIssues: "ఆరోగ్య సమస్యలు & వ్యాధులు తగ్గించే విధానం",
    relatedCrops: "2 / 3 పంటల ప్రణాళిక",
    advancedPlan: "ఆధునిక వ్యవసాయ ప్రణాళిక",
    farmerNote: "రైతు గమనిక",
    duration: "కాలం",
    season: "సీజన్",
    water: "నీటి అవసరం",
    soil: "మట్టి",
    category: "రకం",
    stage: "దశ",
    timing: "సమయం",
    whatToDo: "ఏం చేయాలి",
    why: "ఎందుకు అవసరం",
    symptoms: "లక్షణాలు",
    reduce: "ఎలా తగ్గించాలి",
    selectedCrops: "ఎంచుకున్న పంటలు",
    compatibility: "అనుకూలత",
    suggestions: "సూచనలు",
    openPlanning: "సంబంధిత పంటల ప్రణాళిక తెరవండి",
    openPlanningDesc:
      "ఎంచుకున్న పంటలు Crop Combination Planner పేజీలో ఓపెన్ అవుతాయి. అక్కడ రైతు మొత్తం ఎకరాలు ఇచ్చి పంటల వారీగా భూమి విభజన చూడవచ్చు.",
    advisory:
      "ఇది సాధారణ వ్యవసాయ గైడ్ మాత్రమే. ఎరువులు, పురుగుమందులు మరియు పంట నిర్ణయాలు మట్టి పరీక్ష, స్థానిక వాతావరణం, పంట రకం, పురుగు స్థాయి మరియు వ్యవసాయ అధికారి/KVK సూచనల ప్రకారం మార్చాలి.",
    noCrop: "గైడ్ చూడడానికి ముందుగా పంటను ఎంచుకోండి.",
  },
};

const CROPS = [
  {
    id: "rice",
    en: "Rice",
    te: "వరి",
    icon: "🌾",
    group: "cereal",
    duration: "5–6 months",
    season: "Kharif / Rabi",
    water: "High",
    soil: "Clay / loamy soil",
    related: ["blackgram", "greengram", "sesame"],
  },
  {
    id: "paddy",
    en: "Paddy",
    te: "ప్యాడీ",
    icon: "🌾",
    group: "cereal",
    duration: "5–6 months",
    season: "Kharif / Rabi",
    water: "High",
    soil: "Clay soil",
    related: ["blackgram", "greengram", "sesame"],
  },
  {
    id: "wheat",
    en: "Wheat",
    te: "గోధుమ",
    icon: "🌾",
    group: "cereal",
    duration: "4 months",
    season: "Rabi",
    water: "Medium",
    soil: "Loamy soil",
    related: ["mustard", "bengalgram"],
  },
  {
    id: "maize",
    en: "Maize",
    te: "మొక్కజొన్న",
    icon: "🌽",
    group: "cereal",
    duration: "3–4 months",
    season: "Kharif / Rabi",
    water: "Medium",
    soil: "Well-drained soil",
    related: ["redgram", "cowpea", "groundnut"],
  },
  {
    id: "jowar",
    en: "Jowar",
    te: "జొన్న",
    icon: "🌾",
    group: "cereal",
    duration: "3–4 months",
    season: "Kharif / Rabi",
    water: "Low",
    soil: "Dryland soil",
    related: ["redgram", "cowpea"],
  },
  {
    id: "bajra",
    en: "Bajra",
    te: "సజ్జ",
    icon: "🌾",
    group: "cereal",
    duration: "3–4 months",
    season: "Kharif",
    water: "Low",
    soil: "Sandy loam",
    related: ["greengram", "cowpea"],
  },
  {
    id: "ragi",
    en: "Ragi",
    te: "రాగి",
    icon: "🌾",
    group: "cereal",
    duration: "3–4 months",
    season: "Kharif",
    water: "Low",
    soil: "Red soil / dryland",
    related: ["redgram", "cowpea"],
  },
  {
    id: "tomato",
    en: "Tomato",
    te: "టమోటా",
    icon: "🍅",
    group: "vegetable",
    duration: "3–4 months",
    season: "All seasons with care",
    water: "Medium",
    soil: "Well-drained loamy soil",
    related: ["onion", "coriander", "marigold"],
  },
  {
    id: "chilli",
    en: "Chilli",
    te: "మిర్చి",
    icon: "🌶️",
    group: "spice",
    duration: "5–6 months",
    season: "Kharif / Rabi",
    water: "Medium",
    soil: "Well-drained soil",
    related: ["onion", "coriander", "marigold"],
  },
  {
    id: "onion",
    en: "Onion",
    te: "ఉల్లి",
    icon: "🧅",
    group: "vegetable",
    duration: "4–5 months",
    season: "Rabi / Kharif",
    water: "Medium",
    soil: "Loose fertile soil",
    related: ["tomato", "chilli", "coriander"],
  },
  {
    id: "potato",
    en: "Potato",
    te: "బంగాళాదుంప",
    icon: "🥔",
    group: "vegetable",
    duration: "3–4 months",
    season: "Rabi",
    water: "Medium",
    soil: "Loose well-drained soil",
    related: ["bengalgram", "mustard"],
  },
  {
    id: "brinjal",
    en: "Brinjal",
    te: "వంకాయ",
    icon: "🍆",
    group: "vegetable",
    duration: "4–5 months",
    season: "All seasons",
    water: "Medium",
    soil: "Loamy soil",
    related: ["marigold", "coriander"],
  },
  {
    id: "okra",
    en: "Okra / Ladies Finger",
    te: "బెండకాయ",
    icon: "🌿",
    group: "vegetable",
    duration: "3–4 months",
    season: "Summer / Kharif",
    water: "Medium",
    soil: "Well-drained soil",
    related: ["cowpea", "coriander"],
  },
  {
    id: "cotton",
    en: "Cotton",
    te: "పత్తి",
    icon: "☁️",
    group: "commercial",
    duration: "5–6 months",
    season: "Kharif",
    water: "Medium",
    soil: "Black cotton soil",
    related: ["redgram", "greengram", "cowpea"],
  },
  {
    id: "sugarcane",
    en: "Sugarcane",
    te: "చెరకు",
    icon: "🎋",
    group: "commercial",
    duration: "10–12 months",
    season: "Long duration",
    water: "High",
    soil: "Deep fertile soil",
    related: ["onion", "potato", "greengram"],
  },
  {
    id: "turmeric",
    en: "Turmeric",
    te: "పసుపు",
    icon: "🟡",
    group: "spice",
    duration: "8–9 months",
    season: "Kharif",
    water: "Medium",
    soil: "Well-drained fertile soil",
    related: ["banana", "maize", "onion"],
  },
  {
    id: "ginger",
    en: "Ginger",
    te: "అల్లం",
    icon: "🫚",
    group: "spice",
    duration: "8–9 months",
    season: "Kharif",
    water: "Medium",
    soil: "Loose fertile soil",
    related: ["banana", "maize"],
  },
  {
    id: "garlic",
    en: "Garlic",
    te: "వెల్లుల్లి",
    icon: "🧄",
    group: "spice",
    duration: "4–5 months",
    season: "Rabi",
    water: "Medium",
    soil: "Loose fertile soil",
    related: ["coriander", "mustard"],
  },
  {
    id: "coriander",
    en: "Coriander",
    te: "కొత్తిమీర",
    icon: "🌿",
    group: "spice",
    duration: "1–2 months",
    season: "Rabi / all seasons",
    water: "Low",
    soil: "Well-drained soil",
    related: ["tomato", "onion", "chilli"],
  },
  {
    id: "groundnut",
    en: "Groundnut",
    te: "వేరుశెనగ",
    icon: "🥜",
    group: "oilseed",
    duration: "3–4 months",
    season: "Kharif / Rabi",
    water: "Low-Medium",
    soil: "Sandy loam",
    related: ["redgram", "maize"],
  },
  {
    id: "sunflower",
    en: "Sunflower",
    te: "సూర్యకాంతి",
    icon: "🌻",
    group: "oilseed",
    duration: "3–4 months",
    season: "Rabi / Summer",
    water: "Low-Medium",
    soil: "Well-drained soil",
    related: ["bengalgram"],
  },
  {
    id: "mustard",
    en: "Mustard",
    te: "ఆవాలు",
    icon: "🌼",
    group: "oilseed",
    duration: "3–4 months",
    season: "Rabi",
    water: "Low",
    soil: "Loamy soil",
    related: ["wheat", "bengalgram"],
  },
  {
    id: "sesame",
    en: "Sesame",
    te: "నువ్వులు",
    icon: "🌱",
    group: "oilseed",
    duration: "3 months",
    season: "Kharif / Summer",
    water: "Low",
    soil: "Light soil",
    related: ["greengram", "blackgram"],
  },
  {
    id: "redgram",
    en: "Red Gram / Pigeon Pea",
    te: "కందులు",
    icon: "🫘",
    group: "pulse",
    duration: "5–7 months",
    season: "Kharif",
    water: "Low-Medium",
    soil: "Well-drained soil",
    related: ["cotton", "maize", "jowar"],
  },
  {
    id: "greengram",
    en: "Green Gram",
    te: "పెసర",
    icon: "🫘",
    group: "pulse",
    duration: "2–3 months",
    season: "Kharif / Summer",
    water: "Low",
    soil: "Light soil",
    related: ["rice", "sesame", "maize"],
  },
  {
    id: "blackgram",
    en: "Black Gram",
    te: "మినుము",
    icon: "🫘",
    group: "pulse",
    duration: "2–3 months",
    season: "Kharif / Rabi",
    water: "Low",
    soil: "Well-drained soil",
    related: ["rice", "sesame"],
  },
  {
    id: "bengalgram",
    en: "Bengal Gram / Chickpea",
    te: "సెనగ",
    icon: "🫘",
    group: "pulse",
    duration: "3–4 months",
    season: "Rabi",
    water: "Low",
    soil: "Black soil / loamy soil",
    related: ["wheat", "mustard"],
  },
  {
    id: "cowpea",
    en: "Cowpea",
    te: "అలసందలు",
    icon: "🫘",
    group: "pulse",
    duration: "2–3 months",
    season: "Kharif / Summer",
    water: "Low",
    soil: "Light soil",
    related: ["maize", "jowar", "okra"],
  },
  {
    id: "banana",
    en: "Banana",
    te: "అరటి",
    icon: "🍌",
    group: "fruit",
    duration: "10–12 months",
    season: "All seasons with irrigation",
    water: "High",
    soil: "Deep fertile soil",
    related: ["turmeric", "ginger", "cowpea"],
  },
  {
    id: "mango",
    en: "Mango",
    te: "మామిడి",
    icon: "🥭",
    group: "fruit",
    duration: "Perennial",
    season: "Long-term orchard",
    water: "Low-Medium",
    soil: "Well-drained soil",
    related: ["groundnut", "greengram", "cowpea"],
  },
  {
    id: "papaya",
    en: "Papaya",
    te: "బొప్పాయి",
    icon: "🍈",
    group: "fruit",
    duration: "8–10 months",
    season: "All seasons",
    water: "Medium",
    soil: "Well-drained soil",
    related: ["cowpea", "coriander"],
  },
  {
    id: "watermelon",
    en: "Watermelon",
    te: "పుచ్చకాయ",
    icon: "🍉",
    group: "fruit",
    duration: "3 months",
    season: "Summer",
    water: "Medium",
    soil: "Sandy loam",
    related: ["maize", "cowpea"],
  },
];

const GUIDE_TEMPLATES = {
  cereal: {
    en: {
      process: [
        [
          "Land Preparation",
          "Before sowing/transplanting",
          "Plough well, level the field, add organic manure and plan irrigation/drainage.",
          "Good land preparation helps roots grow and reduces water stress.",
        ],
        [
          "Seed / Nursery",
          "Before planting",
          "Use clean seed, treat seed if advised locally, and keep nursery/seedbed healthy.",
          "Healthy seed reduces early disease and gives uniform crop stand.",
        ],
        [
          "Early Growth",
          "15–25 days",
          "Give first split fertilizer based on crop need and remove weeds early.",
          "Early weeds steal nutrients and reduce yield.",
        ],
        [
          "Mid Growth",
          "35–55 days",
          "Give second nutrient split, check pests, and maintain proper water.",
          "This stage decides tillers, stem strength and future yield.",
        ],
        [
          "Flowering / Grain Formation",
          "Crop middle to late stage",
          "Avoid stress, avoid excess nitrogen, and monitor disease.",
          "Stress during flowering reduces grain formation.",
        ],
        [
          "Harvest & Storage",
          "Maturity stage",
          "Harvest at correct moisture, dry properly and store in clean bags.",
          "Good drying prevents quality loss and fungal damage.",
        ],
      ],
      health: [
        [
          "Seedling disease",
          "Weak seedlings, yellowing, poor germination",
          "Use clean seed, avoid waterlogging, keep nursery clean.",
        ],
        [
          "Leaf spots / blast-like diseases",
          "Brown spots, burnt leaf patches",
          "Avoid excess nitrogen, maintain spacing, use need-based spray after local advice.",
        ],
        [
          "Stem borer / leaf folder",
          "Dead hearts, folded leaves, damaged panicles",
          "Use field scouting, pheromone traps and spray only when infestation is high.",
        ],
      ],
      advanced: [
        "Use soil test before fertilizer planning.",
        "Split nitrogen instead of applying all at once.",
        "Use good field leveling to save water.",
        "Compare mandi price before harvest and plan transport early.",
      ],
    },
    te: {
      process: [
        [
          "భూమి తయారీ",
          "విత్తే / నాటే ముందు",
          "పొలం బాగా దున్ని, సమం చేసి, సేంద్రియ ఎరువు వేసి నీటి నిర్వహణ ప్లాన్ చేయండి.",
          "భూమి బాగా ఉంటే వేర్లు బాగా పెరుగుతాయి మరియు నీటి ఒత్తిడి తగ్గుతుంది.",
        ],
        [
          "విత్తనం / నర్సరీ",
          "నాటే ముందు",
          "శుభ్రమైన విత్తనం వాడండి. అవసరమైతే స్థానిక సలహాతో విత్తన శుద్ధి చేయండి.",
          "ఆరోగ్యకరమైన విత్తనం ప్రారంభ వ్యాధులను తగ్గిస్తుంది.",
        ],
        [
          "ప్రారంభ ఎదుగుదల",
          "15–25 రోజులు",
          "మొదటి విడత ఎరువు ఇవ్వండి మరియు కలుపు తొలగించండి.",
          "కలుపు పోషకాలు తీసుకుని దిగుబడిని తగ్గిస్తుంది.",
        ],
        [
          "మధ్య దశ",
          "35–55 రోజులు",
          "రెండో విడత పోషకాలు ఇవ్వండి, పురుగులు గమనించండి, నీరు సరిగ్గా ఉంచండి.",
          "ఈ దశలో దిగుబడికి పునాది ఏర్పడుతుంది.",
        ],
        [
          "పుష్పం / గింజ దశ",
          "మధ్య నుండి చివరి దశ",
          "ఒత్తిడి రాకుండా చూసుకోండి, అధిక నైట్రోజన్ వద్దు, వ్యాధులు గమనించండి.",
          "ఈ దశలో ఒత్తిడి ఉంటే గింజలు తగ్గుతాయి.",
        ],
        [
          "కోత & నిల్వ",
          "పంట పండినప్పుడు",
          "సరైన తేమలో కోత కోసి, బాగా ఆరబెట్టి శుభ్రమైన సంచుల్లో నిల్వ చేయండి.",
          "బాగా ఆరబెట్టితే నాణ్యత తగ్గదు.",
        ],
      ],
      health: [
        [
          "మొలక వ్యాధులు",
          "బలహీన మొలకలు, పసుపుదనం",
          "శుభ్రమైన విత్తనం వాడండి, నీరు నిల్వ ఉండకుండా చూడండి.",
        ],
        [
          "ఆకు మచ్చలు / బ్లాస్ట్",
          "గోధుమ మచ్చలు, కాలినట్లు ఆకులు",
          "అధిక నైట్రోజన్ వద్దు, సరైన దూరం పాటించండి, అవసరమైతేనే స్ప్రే చేయండి.",
        ],
        [
          "స్టెమ్ బోరర్ / లీఫ్ ఫోల్డర్",
          "డెడ్ హార్ట్స్, ముడుచుకున్న ఆకులు",
          "పొలం పరిశీలన, ఫెరోమోన్ ట్రాప్స్, తీవ్రంగా ఉంటేనే స్ప్రే.",
        ],
      ],
      advanced: [
        "ఎరువుల ముందు మట్టి పరీక్ష చేయించండి.",
        "నైట్రోజన్‌ను విడతలుగా ఇవ్వండి.",
        "నీరు ఆదా చేయడానికి పొలాన్ని సమం చేయండి.",
        "కోతకు ముందు మండీ ధర చూసి రవాణా ప్లాన్ చేయండి.",
      ],
    },
  },

  vegetable: {
    en: {
      process: [
        [
          "Nursery / Seed",
          "Before planting",
          "Use healthy seedlings or clean seed. Avoid overcrowded nursery.",
          "Healthy seedlings reduce early loss.",
        ],
        [
          "Land Preparation",
          "Before transplanting",
          "Add FYM/compost, prepare raised beds and drainage.",
          "Vegetables dislike waterlogging.",
        ],
        [
          "Vegetative Growth",
          "15–30 days",
          "Use balanced nutrients, remove weeds and check sucking pests.",
          "Strong plant frame gives better yield.",
        ],
        [
          "Flowering",
          "30–50 days",
          "Avoid water stress, support pollination and give potash/calcium if needed.",
          "Flower drop reduces production.",
        ],
        [
          "Fruiting / Harvest",
          "After fruit set",
          "Harvest regularly, grade produce and remove diseased fruits.",
          "Regular harvest improves quality and income.",
        ],
      ],
      health: [
        [
          "Leaf curl / sucking pests",
          "Curled leaves, yellowing, sticky leaves",
          "Use yellow/blue sticky traps, remove infected plants, avoid unnecessary sprays.",
        ],
        [
          "Fruit borer",
          "Holes in fruits, damaged fruits",
          "Use pheromone traps, collect damaged fruits, spray only after pest observation.",
        ],
        [
          "Wilt / root rot",
          "Sudden wilting, root damage",
          "Use drainage, crop rotation and avoid waterlogging.",
        ],
      ],
      advanced: [
        "Use drip irrigation and mulching where possible.",
        "Use staking/trellis for tomato, cucumber and gourds.",
        "Grade produce before selling for better price.",
        "Use trap crops like marigold around vegetable crops.",
      ],
    },
    te: {
      process: [
        [
          "నర్సరీ / విత్తనం",
          "నాటే ముందు",
          "ఆరోగ్యకరమైన నారు లేదా శుభ్రమైన విత్తనం వాడండి.",
          "ఆరోగ్యకరమైన నారు ప్రారంభ నష్టాన్ని తగ్గిస్తుంది.",
        ],
        [
          "భూమి తయారీ",
          "నాటే ముందు",
          "FYM/కంపోస్ట్ వేసి, బెడ్స్ చేసి, డ్రైనేజ్ ఏర్పాటు చేయండి.",
          "కూరగాయలకు నీరు నిల్వ ఉండటం మంచిది కాదు.",
        ],
        [
          "మొక్క ఎదుగుదల",
          "15–30 రోజులు",
          "సమతుల్య పోషకాలు ఇవ్వండి, కలుపు తొలగించండి, సక్కింగ్ పెస్ట్స్ గమనించండి.",
          "బలమైన మొక్క మంచి దిగుబడికి సహాయపడుతుంది.",
        ],
        [
          "పుష్ప దశ",
          "30–50 రోజులు",
          "నీటి ఒత్తిడి రాకుండా చూడండి, అవసరమైతే పొటాష్/కాల్షియం ఇవ్వండి.",
          "పువ్వులు రాలితే దిగుబడి తగ్గుతుంది.",
        ],
        [
          "పండ్ల దశ / కోత",
          "పండ్లు వచ్చిన తర్వాత",
          "తరచూ కోత కోయండి, గ్రేడింగ్ చేయండి, వ్యాధిగ్రస్త పండ్లు తొలగించండి.",
          "తరచూ కోత వల్ల నాణ్యత మరియు ఆదాయం మెరుగుపడుతుంది.",
        ],
      ],
      health: [
        [
          "ఆకు ముడత / సక్కింగ్ పురుగులు",
          "ఆకులు ముడుచుకోవడం, పసుపుదనం",
          "స్టికీ ట్రాప్స్ వాడండి, సోకిన మొక్కలు తొలగించండి.",
        ],
        [
          "ఫ్రూట్ బోరర్",
          "పండ్లలో రంధ్రాలు",
          "ఫెరోమోన్ ట్రాప్స్ వాడండి, దెబ్బతిన్న పండ్లు తొలగించండి.",
        ],
        [
          "విల్ట్ / రూట్ రాట్",
          "మొక్క ఒక్కసారిగా వాడిపోవడం",
          "డ్రైనేజ్ ఏర్పాటు చేయండి, పంట మార్పిడి చేయండి.",
        ],
      ],
      advanced: [
        "డ్రిప్ ఇరిగేషన్ మరియు మల్చింగ్ వాడండి.",
        "టమోటా, దోసకాయ, తీగ పంటలకు సపోర్ట్ ఇవ్వండి.",
        "అమ్మే ముందు గ్రేడింగ్ చేస్తే మంచి ధర వస్తుంది.",
        "మేరిగోల్డ్ వంటి ట్రాప్ క్రాప్ ఉపయోగించండి.",
      ],
    },
  },

  pulse: {
    en: {
      process: [
        [
          "Land Preparation",
          "Before sowing",
          "Prepare fine seedbed with drainage.",
          "Pulses need good aeration.",
        ],
        [
          "Sowing",
          "Season start",
          "Use clean seed and maintain spacing.",
          "Proper spacing reduces disease.",
        ],
        [
          "Early Growth",
          "15–25 days",
          "Remove weeds and avoid excess water.",
          "Weeds reduce early growth.",
        ],
        [
          "Flowering / Pod Formation",
          "30–60 days",
          "Avoid water stress and monitor pod borers.",
          "This stage decides final yield.",
        ],
        [
          "Harvest",
          "Maturity",
          "Harvest when pods dry and dry produce properly.",
          "Good drying improves storage quality.",
        ],
      ],
      health: [
        [
          "Wilt",
          "Sudden drying of plants",
          "Use crop rotation, drainage and resistant varieties where possible.",
        ],
        [
          "Pod borer",
          "Damaged pods and seeds",
          "Use pheromone traps and spray only after pest level is high.",
        ],
        [
          "Yellow mosaic",
          "Yellow patches on leaves",
          "Control whitefly, remove infected plants early.",
        ],
      ],
      advanced: [
        "Pulses improve soil nitrogen.",
        "Good option after paddy harvest in many areas.",
        "Use as intercrop with cotton, maize or millets.",
      ],
    },
    te: {
      process: [
        [
          "భూమి తయారీ",
          "విత్తే ముందు",
          "మంచి డ్రైనేజ్‌తో నేలను సిద్ధం చేయండి.",
          "పప్పు పంటలకు గాలి ప్రసరణ అవసరం.",
        ],
        [
          "విత్తడం",
          "సీజన్ ప్రారంభం",
          "శుభ్రమైన విత్తనం వాడి సరైన దూరం పాటించండి.",
          "సరైన దూరం వ్యాధులు తగ్గిస్తుంది.",
        ],
        [
          "ప్రారంభ ఎదుగుదల",
          "15–25 రోజులు",
          "కలుపు తొలగించి నీరు నిల్వ ఉండనివ్వద్దు.",
          "కలుపు పంట ఎదుగుదల తగ్గిస్తుంది.",
        ],
        [
          "పుష్పం / కాయ దశ",
          "30–60 రోజులు",
          "నీటి ఒత్తిడి రాకుండా చూసి కాయ పురుగులు గమనించండి.",
          "ఈ దశలో దిగుబడి నిర్ణయమవుతుంది.",
        ],
        [
          "కోత",
          "పంట పండినప్పుడు",
          "కాయలు ఎండిన తర్వాత కోత కోయండి.",
          "బాగా ఆరబెడితే నిల్వ నాణ్యత పెరుగుతుంది.",
        ],
      ],
      health: [
        [
          "విల్ట్",
          "మొక్కలు ఒక్కసారిగా ఎండిపోవడం",
          "పంట మార్పిడి, డ్రైనేజ్ మరియు నిరోధక రకాలు వాడండి.",
        ],
        [
          "పాడ్ బోరర్",
          "కాయలు, గింజలు దెబ్బతినడం",
          "ఫెరోమోన్ ట్రాప్స్ వాడండి. తీవ్రంగా ఉంటేనే స్ప్రే.",
        ],
        [
          "యెల్లో మోసాయిక్",
          "ఆకులపై పసుపు మచ్చలు",
          "వైట్‌ఫ్లై నియంత్రణ, సోకిన మొక్కలు తొలగించడం.",
        ],
      ],
      advanced: [
        "పప్పు పంటలు మట్టిలో నైట్రోజన్ పెంచుతాయి.",
        "వరి తర్వాత మంచి ఎంపిక.",
        "పత్తి, మొక్కజొన్న, మిల్లెట్లతో అంతర పంటగా వాడవచ్చు.",
      ],
    },
  },
};

const GROUP_FALLBACK = ["commercial", "spice", "oilseed", "fruit"];

function CropKnowledgeCenter() {
  const navigate = useNavigate();

  const [lang, setLang] = useState(localStorage.getItem("appLang") || "en");
  const t = TEXT[lang];

  const [primaryCropId, setPrimaryCropId] = useState("paddy");
  const [secondCropId, setSecondCropId] = useState("blackgram");
  const [thirdCropId, setThirdCropId] = useState("sesame");

  const selectedCrop = useMemo(
    () => CROPS.find((crop) => crop.id === primaryCropId),
    [primaryCropId]
  );

  const secondCrop = useMemo(
    () => CROPS.find((crop) => crop.id === secondCropId),
    [secondCropId]
  );

  const thirdCrop = useMemo(
    () => CROPS.find((crop) => crop.id === thirdCropId),
    [thirdCropId]
  );

  const selectedCrops = [selectedCrop, secondCrop, thirdCrop].filter(Boolean);

  const guide = useMemo(() => {
    if (!selectedCrop) return null;
    return getTemplate(selectedCrop.group)[lang];
  }, [selectedCrop, lang]);

  const relatedCrops = useMemo(() => {
    if (!selectedCrop) return [];

    return selectedCrop.related
      .map((id) => CROPS.find((crop) => crop.id === id))
      .filter(Boolean);
  }, [selectedCrop]);

  const comboPlan = useMemo(() => {
    return getComboPlan(selectedCrops, lang);
  }, [selectedCrops, lang]);

  const changeLanguage = () => {
    const nextLang = lang === "en" ? "te" : "en";
    setLang(nextLang);
    localStorage.setItem("appLang", nextLang);
  };

  const cropLabel = (crop) => {
    if (!crop) return "";
    return lang === "te" ? crop.te : crop.en;
  };

  const openCombinationPlanner = () => {
    navigate("/crop-combination-planner", {
      state: {
        crop1: selectedCrop?.id || "",
        crop2: secondCrop?.id || "",
        crop3: thirdCrop?.id || "",
      },
    });
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
                {t.pageTitle}
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
              onClick={() => navigate("/dashboard")}
              className="bg-slate-100 text-slate-800 px-5 py-3 rounded-xl font-bold"
            >
              {t.backDashboard}
            </button>

            <button
              onClick={() => navigate("/my-crops")}
              className="bg-green-600 text-white px-5 py-3 rounded-xl font-bold"
            >
              {t.myCrops}
            </button>
          </div>
        </div>
      </nav>

      <section className="bg-gradient-to-br from-green-950 via-green-800 to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
          <div>
            <p className="font-bold text-green-100 mb-4">{t.heroSmall}</p>

            <h2 className="text-5xl lg:text-6xl font-black leading-tight">
              {t.heroTitle}
            </h2>

            <p className="text-green-50 text-lg leading-8 mt-6">
              {t.heroDesc}
            </p>

            <div className="flex flex-wrap gap-4 mt-8">
              <button
                onClick={() => window.print()}
                className="bg-white text-green-700 px-7 py-4 rounded-2xl font-black"
              >
                {t.print}
              </button>

              <button
                onClick={() => navigate("/upload")}
                className="bg-white/15 border border-white/30 text-white px-7 py-4 rounded-2xl font-black"
              >
                + {lang === "te" ? "పంట జోడించండి" : "Upload Crop"}
              </button>
            </div>
          </div>

          <div className="bg-white/15 border border-white/20 backdrop-blur rounded-[2rem] p-6">
            <SelectBox
              label={t.selectPrimary}
              value={primaryCropId}
              onChange={setPrimaryCropId}
              crops={CROPS}
              lang={lang}
            />

            <div className="grid md:grid-cols-2 gap-4 mt-5">
              <SelectBox
                label={`${t.selectSecond} (${t.optional})`}
                value={secondCropId}
                onChange={setSecondCropId}
                crops={CROPS}
                lang={lang}
                optional
              />

              <SelectBox
                label={`${t.selectThird} (${t.optional})`}
                value={thirdCropId}
                onChange={setThirdCropId}
                crops={CROPS}
                lang={lang}
                optional
              />
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {!selectedCrop || !guide ? (
          <div className="bg-white rounded-[2rem] shadow-xl p-10 text-center">
            {t.noCrop}
          </div>
        ) : (
          <>
            <section className="grid md:grid-cols-5 gap-5 -mt-20 relative z-10">
              <Metric title={t.category} value={cropLabel(selectedCrop)} />
              <Metric title={t.duration} value={selectedCrop.duration} />
              <Metric title={t.season} value={selectedCrop.season} />
              <Metric title={t.water} value={selectedCrop.water} />
              <Metric title={t.soil} value={selectedCrop.soil} />
            </section>

            <section className="bg-white rounded-[2rem] shadow-xl border border-slate-100 p-8 mt-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">
                <div>
                  <h3 className="text-3xl font-black text-slate-900">
                    {selectedCrop.icon} {cropLabel(selectedCrop)} —{" "}
                    {t.cropProcess}
                  </h3>

                  <p className="text-slate-500 mt-2">
                    {lang === "te"
                      ? "రైతుకు సులభంగా అర్థమయ్యేలా దశల వారీగా పంట ప్రక్రియ."
                      : "Step-by-step crop process explained in farmer-friendly language."}
                  </p>
                </div>

                <span className="bg-green-100 text-green-700 px-5 py-3 rounded-2xl font-black">
                  {selectedCrop.group}
                </span>
              </div>

              <div className="space-y-5">
                {guide.process.map((item, index) => (
                  <ProcessCard
                    key={index}
                    number={index + 1}
                    item={item}
                    t={t}
                  />
                ))}
              </div>
            </section>

            <section className="bg-white rounded-[2rem] shadow-xl border border-slate-100 p-8 mt-8">
              <h3 className="text-3xl font-black text-slate-900">
                {t.healthIssues}
              </h3>

              <div className="grid lg:grid-cols-3 gap-6 mt-8">
                {guide.health.map((item, index) => (
                  <HealthCard key={index} item={item} t={t} />
                ))}
              </div>

              <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-3xl p-6 mt-8">
                <h4 className="text-xl font-black">{t.farmerNote}</h4>
                <p className="leading-7 mt-2">{t.advisory}</p>
              </div>
            </section>

            <section className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8 mt-8">
              <div className="bg-slate-900 text-white rounded-[2rem] shadow-xl p-8">
                <h3 className="text-3xl font-black">{t.relatedCrops}</h3>

                <p className="text-slate-300 leading-7 mt-4">
                  {lang === "te"
                    ? "ముఖ్య పంటతో పాటు 2 లేదా 3 పంటలు ఎంచుకుని సరైన అంతర పంట లేదా పంట మార్పిడి ప్లాన్ చేయండి."
                    : "Choose 2 or 3 crops together and plan intercropping or crop rotation carefully."}
                </p>

                <div className="grid gap-4 mt-6">
                  {selectedCrops.map((crop) => (
                    <div
                      key={crop.id}
                      className="bg-white/10 rounded-3xl p-5 flex items-center gap-4"
                    >
                      <div className="text-4xl">{crop.icon}</div>
                      <div>
                        <h4 className="font-black text-green-200">
                          {cropLabel(crop)}
                        </h4>
                        <p className="text-slate-300 text-sm">
                          {crop.duration} • {crop.water}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-white/10 rounded-3xl p-5 mt-6">
                  <h4 className="font-black text-green-200">
                    {t.compatibility}
                  </h4>
                  <p className="text-slate-300 leading-7 mt-2">
                    {comboPlan.status}
                  </p>
                </div>

                <div className="bg-green-600 rounded-3xl p-6 mt-6">
                  <h4 className="text-2xl font-black text-white">
                    {t.openPlanning}
                  </h4>

                  <p className="text-green-50 leading-7 mt-2">
                    {t.openPlanningDesc}
                  </p>

                  <button
                    type="button"
                    onClick={openCombinationPlanner}
                    className="w-full bg-white text-green-700 px-6 py-4 rounded-2xl font-black mt-5"
                  >
                    {lang === "te"
                      ? "ఎకరాల విభజన ప్లాన్ చూడండి"
                      : "Open Acre Division Plan"}
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 p-8">
                <h3 className="text-3xl font-black text-slate-900">
                  {t.suggestions}
                </h3>

                <div className="grid md:grid-cols-3 gap-4 mt-6">
                  {relatedCrops.map((crop) => (
                    <button
                      key={crop.id}
                      onClick={() => {
                        if (!secondCropId) {
                          setSecondCropId(crop.id);
                        } else if (!thirdCropId) {
                          setThirdCropId(crop.id);
                        } else {
                          setSecondCropId(crop.id);
                        }
                      }}
                      className="bg-green-50 hover:bg-green-100 border border-green-100 rounded-3xl p-5 text-left"
                    >
                      <div className="text-4xl">{crop.icon}</div>
                      <h4 className="text-lg font-black text-green-700 mt-3">
                        {cropLabel(crop)}
                      </h4>
                      <p className="text-sm text-slate-500 mt-1">
                        {crop.duration}
                      </p>
                    </button>
                  ))}
                </div>

                <div className="space-y-4 mt-8">
                  {comboPlan.points.map((point, index) => (
                    <div
                      key={index}
                      className="bg-slate-50 rounded-3xl p-5 border border-slate-100 text-center"
                    >
                      <p className="font-semibold text-slate-700 leading-7">
                        {point}
                      </p>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={openCombinationPlanner}
                  className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-2xl font-black mt-6 shadow-lg"
                >
                  {lang === "te"
                    ? "ఈ 3 పంటలతో పూర్తి ప్లాన్ చూడండి"
                    : "Plan These 3 Crops"}
                </button>
              </div>
            </section>

            <section className="bg-white rounded-[2rem] shadow-xl border border-slate-100 p-8 mt-8">
              <h3 className="text-3xl font-black text-slate-900">
                {t.advancedPlan}
              </h3>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                {guide.advanced.map((plan, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-3xl p-6"
                  >
                    <div className="h-12 w-12 bg-green-600 text-white rounded-2xl flex items-center justify-center font-black">
                      {index + 1}
                    </div>

                    <p className="text-slate-700 font-semibold leading-7 mt-5">
                      {plan}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

function getTemplate(group) {
  if (GUIDE_TEMPLATES[group]) return GUIDE_TEMPLATES[group];
  if (GROUP_FALLBACK.includes(group)) return GUIDE_TEMPLATES.vegetable;
  return GUIDE_TEMPLATES.cereal;
}

function SelectBox({ label, value, onChange, crops, lang, optional }) {
  return (
    <div>
      <label className="block font-black text-white mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl px-4 py-4 text-slate-900 font-bold outline-none"
      >
        {optional && (
          <option value="">{lang === "te" ? "ఎంపిక లేదు" : "None"}</option>
        )}

        {!optional && (
          <option value="">
            {lang === "te" ? "పంట ఎంచుకోండి" : "Choose crop"}
          </option>
        )}

        {crops.map((crop) => (
          <option key={crop.id} value={crop.id}>
            {crop.icon} {lang === "te" ? crop.te : crop.en}
          </option>
        ))}
      </select>
    </div>
  );
}

function ProcessCard({ number, item, t }) {
  return (
    <div className="grid lg:grid-cols-[80px_1fr] gap-5 bg-green-50 border border-green-100 rounded-3xl p-6">
      <div className="h-16 w-16 rounded-3xl bg-green-600 text-white flex items-center justify-center text-2xl font-black">
        {number}
      </div>

      <div>
        <div className="grid md:grid-cols-2 gap-4">
          <InfoBox label={t.stage} value={item[0]} />
          <InfoBox label={t.timing} value={item[1]} />
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <InfoBox label={t.whatToDo} value={item[2]} />
          <InfoBox label={t.why} value={item[3]} />
        </div>
      </div>
    </div>
  );
}

function HealthCard({ item, t }) {
  return (
    <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6">
      <h4 className="text-2xl font-black text-slate-900">{item[0]}</h4>

      <div className="mt-5">
        <p className="text-sm font-black text-slate-500">{t.symptoms}</p>
        <p className="text-slate-700 font-semibold mt-1">{item[1]}</p>
      </div>

      <div className="mt-5">
        <p className="text-sm font-black text-green-700">{t.reduce}</p>
        <p className="text-slate-700 font-semibold mt-1">{item[2]}</p>
      </div>
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

function InfoBox({ label, value }) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-100">
      <p className="text-xs text-slate-500 font-black">{label}</p>
      <p className="text-slate-900 font-bold mt-1 leading-6">{value}</p>
    </div>
  );
}

function getComboPlan(crops, lang) {
  const names = crops.map((crop) => (lang === "te" ? crop.te : crop.en));

  if (crops.length <= 1) {
    return {
      status:
        lang === "te"
          ? "ముఖ్య పంట మాత్రమే ఎంచుకున్నారు. అంతర పంట కోసం మరో 1 లేదా 2 పంటలు ఎంచుకోండి."
          : "Only main crop selected. Choose 1 or 2 more crops for intercropping or rotation planning.",
      points:
        lang === "te"
          ? [
              "ముందుగా నీటి అవసరం ఒకేలా ఉందా చూడండి.",
              "పంటల ఎత్తు, వేర్ల లోతు, సీజన్ సరిపోతాయా చూడండి.",
              "మొదట చిన్న విస్తీర్ణంలో ప్రయోగంగా చేయండి.",
            ]
          : [
              "First check whether water requirement matches.",
              "Check crop height, root depth and season compatibility.",
              "Try on a small area first before full adoption.",
            ],
    };
  }

  const hasRice = crops.some((crop) => crop.id === "rice" || crop.id === "paddy");
  const hasPulse = crops.some((crop) => crop.group === "pulse");
  const hasVegetable = crops.some((crop) => crop.group === "vegetable");
  const hasCotton = crops.some((crop) => crop.id === "cotton");
  const hasFruit = crops.some((crop) => crop.group === "fruit");

  if (hasRice && crops.length > 1) {
    return {
      status:
        lang === "te"
          ? `${names.join(
              " + "
            )}: వరి పొలం నీరు నిల్వ ఉండే విధంగా ఉంటుంది. పప్పు/నూనెగింజ పంటలను వరి తర్వాత పంట మార్పిడి గా లేదా గట్లపై మాత్రమే ప్లాన్ చేయండి.`
          : `${names.join(
              " + "
            )}: Rice fields are usually waterlogged. Use pulses/oilseeds mostly after rice as rotation or on bunds, not inside standing water.`,
      points:
        lang === "te"
          ? [
              "వరి తర్వాత మినుము/పెసర వేస్తే మట్టి మెరుగుపడుతుంది.",
              "వరి పొలంలో నీరు ఉన్నప్పుడు పప్పు పంటలు బాగా రావు.",
              "వరి తర్వాత త్వరగా పండే పంటలను ఎంచుకుంటే అదనపు ఆదాయం వస్తుంది.",
            ]
          : [
              "Black gram or green gram after rice can improve soil and give extra income.",
              "Pulses do not perform well inside standing water.",
              "Short-duration crop after rice helps use remaining soil moisture.",
            ],
    };
  }

  if (hasCotton && hasPulse) {
    return {
      status:
        lang === "te"
          ? `${names.join(
              " + "
            )}: పత్తితో కంది/పప్పు పంటలు మంచి అంతర పంటలుగా ఉపయోగపడతాయి.`
          : `${names.join(
              " + "
            )}: Cotton with pigeon pea/pulses can work well as intercropping in suitable spacing.`,
      points:
        lang === "te"
          ? [
              "పత్తి వరుసల మధ్య సరైన దూరం ఉండాలి.",
              "పప్పు పంటలు మట్టిలో నైట్రోజన్ పెంచుతాయి.",
              "పురుగు మందు వాడేటప్పుడు రెండు పంటలకు సురక్షితమా చూడాలి.",
            ]
          : [
              "Maintain proper spacing between cotton rows.",
              "Pulses help improve soil nitrogen.",
              "When spraying, check safety for both crops.",
            ],
    };
  }

  if (hasFruit && (hasVegetable || hasPulse)) {
    return {
      status:
        lang === "te"
          ? `${names.join(
              " + "
            )}: తోట పంటల మధ్య ప్రారంభ సంవత్సరాల్లో కూరగాయలు లేదా పప్పు పంటలు ప్లాన్ చేయవచ్చు.`
          : `${names.join(
              " + "
            )}: In orchards, vegetables or pulses can be grown during early years if sunlight and water are available.`,
      points:
        lang === "te"
          ? [
              "మొక్కల వేర్లకు నష్టం రాకుండా దూరం పాటించండి.",
              "నీటి మరియు పోషకాల పోటీని గమనించండి.",
              "మల్చింగ్ వాడితే తేమ నిలుస్తుంది.",
            ]
          : [
              "Maintain distance from tree roots.",
              "Watch competition for water and nutrients.",
              "Mulching helps conserve moisture.",
            ],
    };
  }

  if (hasVegetable) {
    return {
      status:
        lang === "te"
          ? `${names.join(
              " + "
            )}: కూరగాయలతో సహాయక పంటలు ప్లాన్ చేస్తే మార్కెట్ రిస్క్ తగ్గుతుంది.`
          : `${names.join(
              " + "
            )}: Combining vegetables with support crops can reduce market risk.`,
      points:
        lang === "te"
          ? [
              "కూరగాయలకు తరచూ నీరు మరియు పర్యవేక్షణ అవసరం.",
              "ఒకే కుటుంబానికి చెందిన కూరగాయలను వరుసగా వేయవద్దు.",
              "పంటలకు వేరు బ్లాక్‌లు లేదా సరైన దూరం పాటించండి.",
            ]
          : [
              "Vegetables need frequent water and monitoring.",
              "Avoid repeating same-family vegetables continuously.",
              "Use separate blocks or proper spacing between crops.",
            ],
    };
  }

  return {
    status:
      lang === "te"
        ? `${names.join(
            " + "
          )}: ఈ కలయిక చేయవచ్చు, కానీ నీరు, సీజన్, దూరం మరియు మార్కెట్ అవసరాన్ని బట్టి ప్లాన్ చేయాలి.`
        : `${names.join(
            " + "
          )}: This combination may work, but plan based on water, season, spacing and market demand.`,
    points:
      lang === "te"
        ? [
            "ఒకే కుటుంబానికి చెందిన పంటలను వరుసగా వేయకుండా పంట మార్పిడి చేయండి.",
            "పొలంలో పురుగు/వ్యాధి చక్రం తగ్గించడానికి పంట మార్పిడి ఉపయోగపడుతుంది.",
            "అమ్మకానికి ముందు మార్కెట్ ధర మరియు కొనుగోలుదారుల అవసరం తెలుసుకోండి.",
          ]
        : [
            "Avoid repeating same family crops continuously.",
            "Crop rotation helps reduce pest and disease cycle.",
            "Check market price and buyer demand before harvest.",
          ],
  };
}

export default CropKnowledgeCenter;