import { useEffect, useMemo, useState } from "react";
import { getVegetablePrices } from "../services/marketPriceService";

export default function Home() {
  const sections = [
    {
      title: "Smart Marketplace",
      desc: "Buy and sell crops directly from farmers with real-time mandi price support.",
      icon: "🌾",
    },
    {
      title: "AI Crop Analysis",
      desc: "AI-powered crop suggestions, disease guidance and farmer-friendly advice.",
      icon: "🤖",
    },
    {
      title: "Farmer Network",
      desc: "Connect farmers, buyers, transporters and exporters in one platform.",
      icon: "🚜",
    },
    {
      title: "Weather Alerts",
      desc: "Weather-based farming decisions for irrigation, spraying and harvesting.",
      icon: "⛅",
    },
    {
      title: "Export Opportunities",
      desc: "Help farmers explore crop export opportunities and better market reach.",
      icon: "🌍",
    },
    {
      title: "Secure Payments",
      desc: "Fast and secure digital transactions between farmers and buyers.",
      icon: "💳",
    },
  ];

  const platforms = [
    {
      name: "DeHaat",
      type: "Farmer Services",
      desc: "Inputs, advisory, marketplace and farmer support.",
      link: "https://www.dehaat.com",
      icon: "🌾",
    },
    {
      name: "JioKrishi",
      type: "Smart Farming",
      desc: "Smart farming, weather and crop monitoring support.",
      link: "https://www.jiokrishi.com",
      icon: "📡",
    },
    {
      name: "NaPanta",
      type: "Mandi + Advisory",
      desc: "Crop prices, pest alerts, weather and farming information.",
      link: "https://www.napanta.com",
      icon: "📊",
    },
    {
      name: "nurture.farm",
      type: "Farm Solutions",
      desc: "Machinery, crop protection, advisory and market access.",
      link: "https://nurture.farm",
      icon: "🚜",
    },
    {
      name: "Kisan Suvidha",
      type: "Government Support",
      desc: "Weather, mandi prices and farmer information services.",
      link: "https://mkisan.gov.in",
      icon: "🏛️",
    },
    {
      name: "Plantix",
      type: "AI Crop Doctor",
      desc: "Crop disease detection and plant health advisory.",
      link: "https://plantix.net",
      icon: "🤖",
    },
  ];

  const vegetables = [
    "All",
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

  const stateDistricts = {
    "Andhra Pradesh": [
      "Anantapur",
      "Chittoor",
      "East Godavari",
      "Guntur",
      "Kadapa",
      "Krishna",
      "Kurnool",
      "Nellore",
      "Prakasam",
      "Srikakulam",
      "Visakhapatnam",
      "Vizianagaram",
      "West Godavari",
    ],
    Telangana: [
      "Adilabad",
      "Hyderabad",
      "Karimnagar",
      "Khammam",
      "Mahbubnagar",
      "Medak",
      "Nalgonda",
      "Nizamabad",
      "Rangareddy",
      "Warangal",
    ],
    Karnataka: [
      "Bangalore",
      "Belgaum",
      "Bellary",
      "Bidar",
      "Chikmagalur",
      "Chitradurga",
      "Dharwad",
      "Gulbarga",
      "Hassan",
      "Kolar",
      "Mandya",
      "Mysore",
      "Raichur",
      "Shimoga",
      "Tumkur",
    ],
    "Tamil Nadu": [
      "Chennai",
      "Coimbatore",
      "Cuddalore",
      "Dharmapuri",
      "Dindigul",
      "Erode",
      "Madurai",
      "Salem",
      "Thanjavur",
      "Tiruchirappalli",
      "Tirunelveli",
      "Vellore",
    ],
    Maharashtra: [
      "Ahmednagar",
      "Amravati",
      "Aurangabad",
      "Jalgaon",
      "Kolhapur",
      "Mumbai",
      "Nagpur",
      "Nashik",
      "Pune",
      "Sangli",
      "Solapur",
    ],
  };

  const [filters, setFilters] = useState({
    state: "Andhra Pradesh",
    district: "",
    market: "",
    commodity: "Tomato",
    limit: 500,
  });

  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const topPrices = useMemo(() => prices.slice(0, 6), [prices]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "state") {
      setFilters((prev) => ({
        ...prev,
        state: value,
        district: "",
        market: "",
      }));
      return;
    }

    if (name === "district") {
      setFilters((prev) => ({
        ...prev,
        district: value,
        market: "",
      }));
      return;
    }

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const loadPrices = async () => {
    try {
      setLoading(true);
      setMessage("");

      const data = await getVegetablePrices(filters);
      const records = data.records || [];

      setPrices(records);

      if (records.length === 0) {
        setMessage(
          "No price records found. Try All Districts, remove market name, or choose another vegetable."
        );
      }
    } catch (error) {
      console.error("PRICE LOAD ERROR:", error);

      const err =
        error.response?.data?.message ||
        "Unable to load live mandi prices. Check Spring Boot backend on port 8085.";

      setMessage(err);
      setPrices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrices();
  }, []);

  return (
    <div className="bg-green-50 min-h-screen text-gray-800">
      {/* NAVBAR */}
      <nav className="bg-white/95 backdrop-blur-md shadow-md sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="h-[88px] flex items-center justify-between">
            <div
              className="flex items-center gap-4 cursor-pointer min-w-fit"
              onClick={() => (window.location.href = "/")}
            >
              <div className="h-14 w-14 bg-green-600 rounded-2xl flex items-center justify-center shadow-lg shrink-0">
                <span className="text-3xl">🌱</span>
              </div>

              <div className="leading-tight">
                <h1 className="text-3xl font-extrabold text-green-700 whitespace-nowrap">
                  RythuLink AI
                </h1>
                <p className="text-sm text-gray-500">
                  Smart Agriculture Platform
                </p>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-8">
              <a href="#home" className="text-[16px] font-semibold text-gray-700 hover:text-green-700 transition">
                Home
              </a>
              <a href="#features" className="text-[16px] font-semibold text-gray-700 hover:text-green-700 transition">
                Features
              </a>
              <a href="#prices" className="text-[16px] font-semibold text-gray-700 hover:text-green-700 transition">
                Live Prices
              </a>
              <a href="#platforms" className="text-[16px] font-semibold text-gray-700 hover:text-green-700 transition">
                Platforms
              </a>
              <a href="#marketplace" className="text-[16px] font-semibold text-gray-700 hover:text-green-700 transition">
                Marketplace
              </a>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => (window.location.href = "/login")}
                className="bg-green-600 hover:bg-green-700 text-white px-5 h-12 rounded-xl font-semibold shadow-md transition"
              >
                Farmer Login
              </button>

              <button
                onClick={() => (window.location.href = "/buyer-login")}
                className="bg-orange-500 hover:bg-orange-600 text-white px-5 h-12 rounded-xl font-semibold shadow-md transition"
              >
                Buyer Login
              </button>

              <button
                onClick={() => (window.location.href = "/admin-login")}
                className="bg-gray-900 hover:bg-black text-white px-5 h-12 rounded-xl font-semibold shadow-md transition"
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section
        id="home"
        className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-14 items-center"
      >
        <div>
          <p className="text-green-700 font-bold text-lg mb-4">
            Indian Farming Platform Inspired
          </p>

          <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight text-green-800">
            Smart Agriculture Marketplace For Modern Farmers
          </h1>

          <p className="text-xl text-gray-600 mt-8 leading-8">
            RythuLink AI helps farmers check live mandi prices, sell crops
            directly to buyers, analyze crop health, arrange transport and
            improve profits using digital agriculture tools.
          </p>

          <div className="flex flex-wrap gap-5 mt-10">
            <a
              href="#prices"
              className="bg-green-600 text-white px-8 py-4 rounded-2xl text-lg hover:bg-green-700 shadow-lg"
            >
              Check Live Prices
            </a>

            <a
              href="#marketplace"
              className="bg-white border border-green-600 text-green-700 px-8 py-4 rounded-2xl text-lg hover:bg-green-100 shadow-lg"
            >
              Explore Marketplace
            </a>
          </div>
        </div>

        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1600&auto=format&fit=crop"
            alt="Farmer in field"
            className="rounded-3xl shadow-2xl h-[550px] w-full object-cover"
          />

          <div className="absolute bottom-6 left-6 bg-white p-6 rounded-2xl shadow-xl">
            <h2 className="text-3xl font-bold text-green-700">
              {prices.length || "Live"}
            </h2>
            <p className="text-gray-600">Mandi Price Records</p>
          </div>

          <div className="absolute top-6 right-6 bg-white p-5 rounded-2xl shadow-xl">
            <p className="text-sm font-semibold text-gray-500">Selected Crop</p>
            <h3 className="text-2xl font-bold text-green-700">
              {filters.commodity}
            </h3>
          </div>
        </div>
      </section>

      {/* QUICK STATS */}
      <section className="bg-green-700 py-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10 text-center text-white">
          <div>
            <h2 className="text-4xl lg:text-5xl font-extrabold">15K+</h2>
            <p className="mt-3 text-lg">Registered Farmers</p>
          </div>

          <div>
            <h2 className="text-4xl lg:text-5xl font-extrabold">50K+</h2>
            <p className="mt-3 text-lg">Crop Listings</p>
          </div>

          <div>
            <h2 className="text-4xl lg:text-5xl font-extrabold">₹12Cr+</h2>
            <p className="mt-3 text-lg">Transactions</p>
          </div>

          <div>
            <h2 className="text-4xl lg:text-5xl font-extrabold">120+</h2>
            <p className="mt-3 text-lg">District Coverage</p>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="bg-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-green-700">
              Powerful Platform Features
            </h2>
            <p className="text-gray-600 mt-5 text-xl">
              Everything farmers need in one platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sections.map((item, index) => (
              <div
                key={index}
                className="bg-green-50 p-8 rounded-3xl shadow-lg hover:scale-105 transition duration-300"
              >
                <div className="text-6xl mb-6">{item.icon}</div>

                <h3 className="text-2xl font-bold text-green-700">
                  {item.title}
                </h3>

                <p className="text-gray-600 mt-4 leading-7 text-lg">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LIVE PRICE DASHBOARD */}
      <section id="prices" className="py-20 px-6 bg-green-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-green-700 font-bold text-lg">
              Current Vegetable Prices
            </p>
            <h2 className="text-4xl lg:text-5xl font-bold text-green-700 mt-3">
              Live Mandi Price Dashboard
            </h2>
            <p className="text-gray-600 mt-5 text-lg">
              Select state, district and vegetable to check min, max and modal
              mandi prices.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-6 lg:p-8 mb-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-5">
              <div>
                <label className="block font-bold text-gray-700 mb-2">
                  State
                </label>
                <select
                  name="state"
                  value={filters.state}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                >
                  {Object.keys(stateDistricts).map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-2">
                  District
                </label>
                <select
                  name="district"
                  value={filters.district}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">All Districts</option>
                  {(stateDistricts[filters.state] || []).map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-2">
                  Market
                </label>
                <input
                  name="market"
                  value={filters.market}
                  onChange={handleChange}
                  placeholder="Optional"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-2">
                  Vegetable
                </label>
                <select
                  name="commodity"
                  value={filters.commodity}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                >
                  {vegetables.map((veg) => (
                    <option key={veg} value={veg}>
                      {veg}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={loadPrices}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white rounded-xl px-5 py-3 font-bold shadow-md self-end"
              >
                {loading ? "Loading..." : "Search Price"}
              </button>
            </div>
          </div>

          {message && (
            <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 rounded-2xl px-6 py-4 mb-8 font-semibold">
              {message}
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-3xl shadow-lg p-7">
              <p className="text-gray-500 font-semibold">Total Records</p>
              <h3 className="text-4xl font-extrabold text-green-700 mt-2">
                {prices.length}
              </h3>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-7">
              <p className="text-gray-500 font-semibold">Selected Vegetable</p>
              <h3 className="text-4xl font-extrabold text-green-700 mt-2">
                {filters.commodity}
              </h3>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-7">
              <p className="text-gray-500 font-semibold">Price Source</p>
              <h3 className="text-4xl font-extrabold text-green-700 mt-2">
                AGMARKNET
              </h3>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl overflow-x-auto">
            <table className="w-full min-w-[1000px] border-collapse">
              <thead>
                <tr className="bg-green-700 text-white text-left">
                  <th className="p-5">Vegetable</th>
                  <th className="p-5">Market</th>
                  <th className="p-5">District</th>
                  <th className="p-5">Date</th>
                  <th className="p-5">Min</th>
                  <th className="p-5">Modal</th>
                  <th className="p-5">Max</th>
                  <th className="p-5">Approx / kg</th>
                </tr>
              </thead>

              <tbody>
                {topPrices.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-green-50">
                    <td className="p-5">
                      <b className="text-green-700">{item.commodity}</b>
                      <p className="text-sm text-gray-500">
                        {item.variety || "Other"}
                      </p>
                    </td>
                    <td className="p-5">{item.market || "-"}</td>
                    <td className="p-5">{item.district || "-"}</td>
                    <td className="p-5">{item.arrivalDate || "-"}</td>
                    <td className="p-5">₹{item.minPrice}/q</td>
                    <td className="p-5 font-bold text-green-700">
                      ₹{item.modalPrice}/q
                    </td>
                    <td className="p-5">₹{item.maxPrice}/q</td>
                    <td className="p-5">
                      <b>₹{item.modalPerKg}/kg</b>
                    </td>
                  </tr>
                ))}

                {!loading && topPrices.length === 0 && (
                  <tr>
                    <td colSpan="8" className="p-8 text-center text-gray-500">
                      No price data available. Try another filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {prices.length > 6 && (
            <p className="text-center text-gray-600 mt-5">
              Showing first 6 records out of {prices.length}. Use filters for
              more specific result.
            </p>
          )}
        </div>
      </section>

      {/* REFERENCE PLATFORMS */}
      <section id="platforms" className="bg-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-green-700 font-bold text-lg">
              Indian Farming References
            </p>
            <h2 className="text-4xl lg:text-5xl font-bold text-green-700 mt-3">
              Inspired By Real Farming Platforms
            </h2>
            <p className="text-gray-600 mt-5 text-xl">
              Study these platforms for marketplace, advisory, weather and crop
              disease detection ideas.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {platforms.map((platform) => (
              <div
                key={platform.name}
                className="bg-green-50 p-8 rounded-3xl shadow-lg hover:scale-105 transition duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center text-4xl shadow">
                    {platform.icon}
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-green-700">
                      {platform.name}
                    </h3>
                    <p className="text-sm font-bold text-orange-600">
                      {platform.type}
                    </p>
                  </div>
                </div>

                <p className="text-gray-600 mt-5 leading-7 text-lg">
                  {platform.desc}
                </p>

                <a
                  href={platform.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block mt-6 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700"
                >
                  Visit Website
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MARKETPLACE */}
      <section id="marketplace" className="py-20 px-6 bg-green-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-12">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-green-700">
                Trending Crops
              </h2>
              <p className="text-gray-600 mt-4 text-lg">
                Fresh crops directly from farmers with mandi price support.
              </p>
            </div>

            <button className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700">
              View All Crops
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                name: "Tomato",
                price: "Live Price",
                image:
                  "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?q=80&w=1200&auto=format&fit=crop",
              },
              {
                name: "Onion",
                price: "Mandi Based",
                image:
                  "https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?q=80&w=1200&auto=format&fit=crop",
              },
              {
                name: "Green Chilli",
                price: "Market Trend",
                image:
                  "https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?q=80&w=1200&auto=format&fit=crop",
              },
            ].map((crop, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl overflow-hidden shadow-xl hover:scale-105 transition duration-300"
              >
                <img
                  src={crop.image}
                  alt={crop.name}
                  className="h-72 w-full object-cover"
                />

                <div className="p-6">
                  <div className="flex justify-between items-center gap-3">
                    <h3 className="text-3xl font-bold text-green-700">
                      {crop.name}
                    </h3>

                    <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold">
                      {crop.price}
                    </span>
                  </div>

                  <p className="text-gray-600 mt-5 leading-7">
                    Premium quality crops available directly from verified
                    farmers.
                  </p>

                  <button className="w-full mt-6 bg-green-600 text-white py-4 rounded-2xl hover:bg-green-700 text-lg font-semibold">
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ANALYTICS */}
      <section id="analytics" className="bg-white py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-green-700">
            Platform Analytics
          </h2>

          <div className="grid md:grid-cols-4 gap-8 mt-16">
            <div className="bg-green-50 p-10 rounded-3xl shadow-lg">
              <h3 className="text-5xl font-bold text-green-700">15K+</h3>
              <p className="mt-4 text-gray-600 text-xl">Farmers</p>
            </div>

            <div className="bg-green-50 p-10 rounded-3xl shadow-lg">
              <h3 className="text-5xl font-bold text-green-700">50K+</h3>
              <p className="mt-4 text-gray-600 text-xl">Crop Listings</p>
            </div>

            <div className="bg-green-50 p-10 rounded-3xl shadow-lg">
              <h3 className="text-5xl font-bold text-green-700">120+</h3>
              <p className="mt-4 text-gray-600 text-xl">Districts</p>
            </div>

            <div className="bg-green-50 p-10 rounded-3xl shadow-lg">
              <h3 className="text-5xl font-bold text-green-700">₹12Cr+</h3>
              <p className="mt-4 text-gray-600 text-xl">Transactions</p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="bg-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-green-700">
            Join The Agriculture Revolution
          </h2>

          <p className="text-gray-600 text-xl mt-6 leading-8">
            Empowering farmers with live prices, marketplace, AI crop advisor
            and digital agriculture technology.
          </p>

          <div className="flex flex-wrap justify-center gap-5 mt-10">
            <button
              onClick={() => (window.location.href = "/register")}
              className="bg-green-600 text-white px-10 py-4 rounded-2xl text-lg hover:bg-green-700 shadow-lg"
            >
              Farmer Register
            </button>

            <button
              onClick={() => (window.location.href = "/buyer-register")}
              className="bg-orange-500 text-white px-10 py-4 rounded-2xl text-lg hover:bg-orange-600 shadow-lg"
            >
              Buyer Register
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-green-800 text-white py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-5">
          <div>
            <h2 className="text-3xl font-bold">RythuLink AI 🌱</h2>
            <p className="mt-3 text-green-100">
              Smart Farming • AI Marketplace • Digital Agriculture
            </p>
          </div>

          <div className="flex gap-6 text-lg">
            <a href="#home">Home</a>
            <a href="#prices">Prices</a>
            <a href="#platforms">Platforms</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}