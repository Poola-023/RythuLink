const express = require("express");

const router = express.Router();

const RESOURCE_ID = "9ef84268-d588-465a-a308-a864a43d0070";

// Public demo key from data.gov.in examples.
// Better: create your own free data.gov.in API key later and put it in .env.
const DATA_GOV_API_KEY =
  process.env.DATA_GOV_API_KEY ||
  "579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b";

const VEGETABLES = [
  "Tomato",
  "Onion",
  "Potato",
  "Brinjal",
  "Bhindi(Ladies Finger)",
  "Bitter gourd",
  "Bottle gourd",
  "Cabbage",
  "Capsicum",
  "Carrot",
  "Cauliflower",
  "Green Chilli",
  "Cucumbar(Kheera)",
  "Drumstick",
  "Pumpkin",
  "Raddish",
  "Ridgeguard(Tori)",
  "Snakeguard",
  "Sweet Potato",
  "Cluster beans",
  "French Beans(Frasbean)",
  "Beetroot",

  // Added more
  "Garlic",
  "Ginger(Green)",
  "Peas Wet",
  "Spinach",
  "Coriander(Leaves)",
  "Methi(Leaves)",
  "Mint(Pudina)",
  "Knool Khol",
  "Turnip",
  "Yam",
  "Colacasia",
  "Elephant Yam",
  "Ashgourd",
  "Little gourd",
  "Pointed gourd",
];

function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function isVegetable(record) {
  const commodity = normalize(record.commodity);

  return VEGETABLES.some((veg) => {
    const v = normalize(veg);
    return commodity === v || commodity.includes(v) || v.includes(commodity);
  });
}

function toNumber(value) {
  const num = Number(String(value || "").replace(/,/g, ""));
  return Number.isNaN(num) ? 0 : num;
}

function quintalToKg(value) {
  const num = toNumber(value);
  return num ? (num / 100).toFixed(2) : "0.00";
}

router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Market price route working",
  });
});

router.get("/vegetables", async (req, res) => {
  try {
    const {
      state = "",
      district = "",
      market = "",
      commodity = "",
      limit = 1000,
    } = req.query;

    const params = new URLSearchParams();

    params.append("api-key", DATA_GOV_API_KEY);
    params.append("format", "json");
    params.append("limit", String(Math.min(Number(limit) || 1000, 5000)));

    if (state) params.append("filters[state]", state);
    if (district) params.append("filters[district]", district);
    if (market) params.append("filters[market]", market);

    if (commodity && commodity !== "All") {
      params.append("filters[commodity]", commodity);
    }

    const url = `https://api.data.gov.in/resource/${RESOURCE_ID}?${params.toString()}`;

    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        success: false,
        message: "Failed to fetch mandi prices from data.gov.in",
        error: errorText,
      });
    }

    const data = await response.json();

    let records = data.records || [];

    if (!commodity || commodity === "All") {
      records = records.filter(isVegetable);
    }

    const formatted = records.map((item, index) => ({
      id: index + 1,
      state: item.state || "",
      district: item.district || "",
      market: item.market || "",
      commodity: item.commodity || "",
      variety: item.variety || "",
      grade: item.grade || "",
      arrivalDate: item.arrival_date || item.date || "",
      minPrice: toNumber(item.min_price),
      maxPrice: toNumber(item.max_price),
      modalPrice: toNumber(item.modal_price),
      minPerKg: quintalToKg(item.min_price),
      maxPerKg: quintalToKg(item.max_price),
      modalPerKg: quintalToKg(item.modal_price),
    }));

    res.json({
      success: true,
      source: "data.gov.in / AGMARKNET",
      count: formatted.length,
      records: formatted,
    });
  } catch (error) {
    console.error("Market Price Error:", error);

    res.status(500).json({
      success: false,
      message: "Market price fetch failed",
      error: error.message,
    });
  }
});

module.exports = router;