import { useMemo, useState } from "react";
import { getFarmingProductPrices } from "../services/marketPriceService";

const categories = {
  Cereals: [
    "Paddy(Dhan)(Common)",
    "Rice",
    "Wheat",
    "Maize",
    "Jowar(Sorghum)",
    "Bajra(Pearl Millet/Cumbu)",
    "Ragi (Finger Millet)",
  ],
  Pulses: [
    "Bengal Gram(Gram)(Whole)",
    "Green Gram (Moong)(Whole)",
    "Black Gram (Urd Beans)(Whole)",
    "Red Gram",
    "Lentil (Masur)(Whole)",
  ],
  Oilseeds: [
    "Groundnut",
    "Soyabean",
    "Sunflower",
    "Mustard",
    "Sesamum(Sesame,Gingelly,Til)",
    "Castor Seed",
  ],
  Spices: [
    "Turmeric",
    "Dry Chillies",
    "Ginger(Dry)",
    "Garlic",
    "Coriander Seed",
    "Cummin Seed(Jeera)",
  ],
  Commercial: ["Cotton", "Jute", "Sugarcane", "Tobacco"],
  Fruits: [
    "Banana",
    "Mango",
    "Papaya",
    "Guava",
    "Apple",
    "Grapes",
    "Orange",
    "Pomegranate",
    "Water Melon",
  ],
};

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
  "Uttar Pradesh": [
    "Agra",
    "Aligarh",
    "Balrampur",
    "Bareilly",
    "Gorakhpur",
    "Kanpur",
    "Lucknow",
    "Prayagraj",
    "Shravasti",
    "Varanasi",
  ],
};

function FarmingProducts() {
  const [filters, setFilters] = useState({
    state: "",
    district: "",
    market: "",
    category: "",
    commodity: "",
    limit: 5000,
  });

  const [records, setRecords] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [sortBy, setSortBy] = useState("modalHigh");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 10;

  const products = useMemo(() => {
    if (!filters.category) return [];
    return categories[filters.category] || [];
  }, [filters.category]);

  const normalize = (value) =>
    String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");

  const same = (a, b) => {
    if (!b) return true;
    return normalize(a) === normalize(b);
  };

  const contains = (a, b) => {
    if (!b) return true;
    return normalize(a).includes(normalize(b));
  };

  const categoryMatch = (commodity) => {
    if (!filters.category) return true;

    const list = categories[filters.category] || [];

    return list.some((product) => {
      const p = normalize(product);
      const c = normalize(commodity);
      return c === p || c.includes(p) || p.includes(c);
    });
  };

  const productMatch = (commodity) => {
    if (!filters.commodity) return true;

    const c = normalize(commodity);
    const selected = normalize(filters.commodity);

    return c === selected || c.includes(selected) || selected.includes(c);
  };

  const filteredRecords = useMemo(() => {
    let list = [...records];

    list = list.filter((item) => same(item.state, filters.state));

    if (filters.district) {
      list = list.filter((item) => same(item.district, filters.district));
    }

    if (filters.market) {
      list = list.filter((item) => contains(item.market, filters.market));
    }

    list = list.filter((item) => categoryMatch(item.commodity));
    list = list.filter((item) => productMatch(item.commodity));

    if (searchText.trim()) {
      const key = normalize(searchText);

      list = list.filter((item) => {
        return (
          normalize(item.commodity).includes(key) ||
          normalize(item.market).includes(key) ||
          normalize(item.district).includes(key) ||
          normalize(item.state).includes(key) ||
          normalize(item.variety).includes(key) ||
          normalize(item.arrivalDate).includes(key)
        );
      });
    }

    list.sort((a, b) => {
      if (sortBy === "modalHigh") return Number(b.modalPrice || 0) - Number(a.modalPrice || 0);
      if (sortBy === "modalLow") return Number(a.modalPrice || 0) - Number(b.modalPrice || 0);
      if (sortBy === "product") return String(a.commodity || "").localeCompare(String(b.commodity || ""));
      if (sortBy === "market") return String(a.market || "").localeCompare(String(b.market || ""));
      return 0;
    });

    return list;
  }, [records, filters, searchText, sortBy]);

  const totalPages = Math.ceil(filteredRecords.length / rowsPerPage) || 1;

  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredRecords.slice(start, start + rowsPerPage);
  }, [filteredRecords, currentPage]);

  const insights = useMemo(() => {
    if (!filteredRecords.length) {
      return {
        avgKg: "0.00",
        highest: null,
        lowest: null,
        markets: 0,
      };
    }

    const total = filteredRecords.reduce(
      (sum, item) => sum + Number(item.modalPrice || 0),
      0
    );

    const sortedByPrice = [...filteredRecords].sort(
      (a, b) => Number(b.modalPrice || 0) - Number(a.modalPrice || 0)
    );

    const uniqueMarkets = new Set(
      filteredRecords.map((item) => `${item.market}-${item.district}`)
    );

    return {
      avgKg: (total / filteredRecords.length / 100).toFixed(2),
      highest: sortedByPrice[0],
      lowest: sortedByPrice[sortedByPrice.length - 1],
      markets: uniqueMarkets.size,
    };
  }, [filteredRecords]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setCurrentPage(1);

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

    if (name === "category") {
      setFilters((prev) => ({
        ...prev,
        category: value,
        commodity: "",
      }));
      return;
    }

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const loadProductPrices = async () => {
    if (!filters.state) {
      setMessage("Please select a state first.");
      setRecords([]);
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      setCurrentPage(1);

      const data = await getFarmingProductPrices({
        state: filters.state,
        district: filters.district,
        market: filters.market,
        commodity: filters.commodity,
        limit: filters.limit,
      });

      const result = data.records || [];
      setRecords(result);

      if (result.length === 0) {
        setMessage("No records found. Try selecting only state or choose another product.");
      }
    } catch (error) {
      console.error("FARMING PRODUCT PRICE ERROR:", error);

      const err =
        error.response?.data?.message ||
        "Unable to load farming product prices. Check Spring Boot backend on port 8085.";

      setMessage(err);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    if (!filteredRecords.length) {
      alert("No records to export");
      return;
    }

    const headers = [
      "Product",
      "Variety",
      "Market",
      "District",
      "State",
      "Date",
      "Min Price",
      "Modal Price",
      "Max Price",
      "Approx / kg",
    ];

    const rows = filteredRecords.map((item) => [
      item.commodity,
      item.variety,
      item.market,
      item.district,
      item.state,
      item.arrivalDate,
      item.minPrice,
      item.modalPrice,
      item.maxPrice,
      item.modalPerKg,
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell || ""}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "rythulink-farming-prices.csv";
    a.click();

    URL.revokeObjectURL(url);
  };

  const resetFilters = () => {
    setFilters({
      state: "",
      district: "",
      market: "",
      category: "",
      commodity: "",
      limit: 5000,
    });
    setRecords([]);
    setSearchText("");
    setSortBy("modalHigh");
    setCurrentPage(1);
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-[#f4f8f5] text-slate-900">
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-[88px] flex items-center justify-between">
          <div
            className="flex items-center gap-4 cursor-pointer"
            onClick={() => (window.location.href = "/")}
          >
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-green-600 to-emerald-400 flex items-center justify-center shadow-lg">
              <span className="text-3xl">🌱</span>
            </div>

            <div>
              <h1 className="text-3xl font-black tracking-tight">RythuLink AI</h1>
              <p className="text-sm text-slate-500">Market Intelligence Dashboard</p>
            </div>
          </div>

          <div className="hidden md:flex gap-3">
            <button
              onClick={() => (window.location.href = "/")}
              className="bg-green-50 text-green-700 px-5 py-3 rounded-xl font-bold"
            >
              Home
            </button>

            <button
              onClick={exportCSV}
              className="bg-slate-900 text-white px-5 py-3 rounded-xl font-bold"
            >
              Export CSV
            </button>
          </div>
        </div>
      </nav>

      <section className="bg-gradient-to-br from-green-900 via-green-700 to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-14 grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-center">
          <div>
            <p className="font-bold text-green-100 mb-4">AGMARKNET Price Intelligence</p>
            <h2 className="text-5xl lg:text-6xl font-black leading-tight">
              Professional crop pricing for better selling decisions
            </h2>
            <p className="text-green-50 text-lg leading-8 mt-6 max-w-3xl">
              Search farming products by state, district, market, category or crop.
              Compare modal prices, high-value markets and approximate per-kg price.
            </p>
          </div>

          <div className="bg-white/15 backdrop-blur rounded-3xl p-6 border border-white/20">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white text-slate-900 rounded-2xl p-5">
                <p className="text-slate-500 font-semibold">Records</p>
                <h3 className="text-4xl font-black text-green-700">{filteredRecords.length}</h3>
              </div>

              <div className="bg-white text-slate-900 rounded-2xl p-5">
                <p className="text-slate-500 font-semibold">Avg / kg</p>
                <h3 className="text-4xl font-black text-green-700">₹{insights.avgKg}</h3>
              </div>

              <div className="bg-white text-slate-900 rounded-2xl p-5 col-span-2">
                <p className="text-slate-500 font-semibold">Best Market</p>
                <h3 className="text-2xl font-black text-green-700">
                  {insights.highest?.market || "Select state and search"}
                </h3>
                <p className="text-slate-500 mt-1">
                  {insights.highest
                    ? `₹${insights.highest.modalPerKg}/kg • ${insights.highest.district}`
                    : "Highest modal price will appear here"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 p-6 lg:p-8 -mt-20 relative z-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-5">
            <Field label="State">
              <select
                name="state"
                value={filters.state}
                onChange={handleChange}
                className="input"
              >
                <option value="">Select State</option>
                {Object.keys(stateDistricts).map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </Field>

            <Field label="District">
              <select
                name="district"
                value={filters.district}
                onChange={handleChange}
                disabled={!filters.state}
                className="input disabled:bg-slate-100"
              >
                <option value="">All Districts</option>
                {(stateDistricts[filters.state] || []).map((district) => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </Field>

            <Field label="Market">
              <input
                name="market"
                value={filters.market}
                onChange={handleChange}
                placeholder="Optional"
                className="input"
              />
            </Field>

            <Field label="Category">
              <select
                name="category"
                value={filters.category}
                onChange={handleChange}
                className="input"
              >
                <option value="">All Categories</option>
                {Object.keys(categories).map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </Field>

            <Field label="Product">
              <select
                name="commodity"
                value={filters.commodity}
                onChange={handleChange}
                disabled={!filters.category}
                className="input disabled:bg-slate-100"
              >
                <option value="">All Products</option>
                {products.map((product) => (
                  <option key={product} value={product}>{product}</option>
                ))}
              </select>
            </Field>

            <button
              onClick={loadProductPrices}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white rounded-2xl px-5 py-3 font-black shadow-lg self-end"
            >
              {loading ? "Loading..." : "Search"}
            </button>
          </div>

          <div className="grid md:grid-cols-[1fr_220px_120px] gap-4 mt-6">
            <input
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search product, market, district, variety, date..."
              className="input"
            />

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input"
            >
              <option value="modalHigh">Modal price high to low</option>
              <option value="modalLow">Modal price low to high</option>
              <option value="product">Product A-Z</option>
              <option value="market">Market A-Z</option>
            </select>

            <button
              onClick={resetFilters}
              className="bg-slate-100 text-slate-800 rounded-2xl font-black"
            >
              Reset
            </button>
          </div>
        </div>

        {message && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl px-6 py-4 mt-8 font-semibold">
            {message}
          </div>
        )}

        <div className="grid md:grid-cols-4 gap-6 mt-8">
          <Metric title="Markets Found" value={insights.markets} />
          <Metric title="Average / kg" value={`₹${insights.avgKg}`} />
          <Metric
            title="Highest / kg"
            value={insights.highest ? `₹${insights.highest.modalPerKg}` : "₹0.00"}
          />
          <Metric
            title="Lowest / kg"
            value={insights.lowest ? `₹${insights.lowest.modalPerKg}` : "₹0.00"}
          />
        </div>

        <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden mt-8">
          <div className="px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b">
            <div>
              <h3 className="text-2xl font-black">Price Results</h3>
              <p className="text-slate-500">
                Showing {paginatedRecords.length} of {filteredRecords.length} records
              </p>
            </div>

            <button
              onClick={exportCSV}
              className="bg-green-600 text-white px-5 py-3 rounded-xl font-bold"
            >
              Download Report
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead className="bg-slate-900 text-white text-left">
                <tr>
                  <th className="p-5">Product</th>
                  <th className="p-5">Market</th>
                  <th className="p-5">District</th>
                  <th className="p-5">State</th>
                  <th className="p-5">Date</th>
                  <th className="p-5">Min</th>
                  <th className="p-5">Modal</th>
                  <th className="p-5">Max</th>
                  <th className="p-5">Approx / kg</th>
                </tr>
              </thead>

              <tbody>
                {paginatedRecords.map((item, index) => (
                  <tr
                    key={`${item.id}-${item.market}-${item.commodity}-${index}`}
                    className="border-b hover:bg-green-50"
                  >
                    <td className="p-5">
                      <b className="text-green-700">{item.commodity}</b>
                      <p className="text-sm text-slate-500">{item.variety || "Other"}</p>
                    </td>
                    <td className="p-5 font-semibold">{item.market || "-"}</td>
                    <td className="p-5">{item.district || "-"}</td>
                    <td className="p-5">{item.state || "-"}</td>
                    <td className="p-5">{item.arrivalDate || "-"}</td>
                    <td className="p-5">₹{item.minPrice}/q</td>
                    <td className="p-5 font-black text-green-700">₹{item.modalPrice}/q</td>
                    <td className="p-5">₹{item.maxPrice}/q</td>
                    <td className="p-5">
                      <span className="bg-green-100 text-green-800 px-3 py-2 rounded-xl font-black">
                        ₹{item.modalPerKg}/kg
                      </span>
                    </td>
                  </tr>
                ))}

                {!loading && paginatedRecords.length === 0 && (
                  <tr>
                    <td colSpan="9" className="p-10 text-center text-slate-500">
                      Select a state and search to view market intelligence.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-5 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-600 font-semibold">
              Page {currentPage} of {totalPages}
            </p>

            <div className="flex gap-3">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className="px-5 py-3 rounded-xl bg-slate-100 text-slate-800 font-bold disabled:opacity-50"
              >
                Previous
              </button>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                className="px-5 py-3 rounded-xl bg-green-600 text-white font-bold disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        .input {
          width: 100%;
          border: 1px solid #e2e8f0;
          border-radius: 1rem;
          padding: 0.9rem 1rem;
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

function Field({ label, children }) {
  return (
    <div>
      <label className="block font-black text-slate-700 mb-2">{label}</label>
      {children}
    </div>
  );
}

function Metric({ title, value }) {
  return (
    <div className="bg-white rounded-3xl p-7 shadow-lg border border-slate-100">
      <p className="text-slate-500 font-bold">{title}</p>
      <h3 className="text-4xl font-black text-green-700 mt-2">{value}</h3>
    </div>
  );
}

export default FarmingProducts;