import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const API_URL = "/api/crops";

const TEXT = {
  en: {
    appTitle: "My Crop Portfolio",
    subtitle: "Manage listings, pricing, quality and crop dashboard",
    dashboard: "Dashboard",
    addCrop: "Add Crop",
    addNewListing: "Add New Listing",
    exportReport: "Export Report",
    heroSmall: "Farmer Crop Control Center",
    heroTitle: "Manage your crops like a real agri-business",
    heroDesc:
      "Track quantity, selling price, estimated value, market readiness and crop-specific recommendations from one professional dashboard.",
    totalListings: "Total Listings",
    totalQuantity: "Total Quantity",
    estimatedValue: "Estimated Value",
    averagePrice: "Average Price",
    searchPlaceholder: "Search crop, location, farmer, description...",
    latestFirst: "Latest First",
    priceHigh: "Price High to Low",
    priceLow: "Price Low to High",
    quantityHigh: "Quantity High to Low",
    cropNameAZ: "Crop Name A-Z",
    gridView: "Grid View",
    tableView: "Table View",
    refresh: "Refresh",
    listings: "Listings",
    inventory: "Inventory",
    value: "Value",
    avgPrice: "Avg Price",
    noCrops: "No crops found",
    noCropsDesc: "Add your first crop listing or change the search filter.",
    loading: "Loading your crop portfolio...",
    loginRequired: "Login Required",
    loginMessage: "Farmer ID not found. Please login again to manage crops.",
    goLogin: "Go to Login",
    share: "Share",
    quantity: "Quantity",
    price: "Price",
    edit: "Edit",
    delete: "Delete",
    comparePrice: "Compare Price",
    openDashboard: "Open Dashboard",
    crop: "Crop",
    farmer: "Farmer",
    location: "Location",
    actions: "Actions",
    view: "View",
    cropId: "Crop ID",
    listingDetails: "Listing Details",
    editCrop: "Edit Crop",
    editSubtitle: "Update listing details and pricing.",
    cropName: "Crop Name",
    quantityKg: "Quantity KG",
    priceKg: "Price / KG",
    description: "Description",
    cancel: "Cancel",
    updateCrop: "Update Crop",
    noDescription: "No description added for this crop.",
    noDescriptionAvailable: "No description available.",
    noLocation: "Location not added",
    notAvailable: "Not available",
    confirmDelete: "Are you sure you want to delete this crop?",
    deleteSuccess: "Crop deleted successfully",
    deleteFailed: "Delete failed",
    updateSuccess: "Crop updated successfully",
    updateFailed: "Update failed",
    copied: "Crop listing copied",
    noExport: "No crops to export",
    languageButton: "తెలుగు",
    status: {
      bulk: "Bulk Lot",
      premium: "Premium Price",
      lowStock: "Low Stock",
      ready: "Ready to Sell",
    },
    tips: {
      tomatoTitle: "Tomato crop care",
      tomatoText:
        "Check for leaf curl, early blight and fruit borer. Avoid water on leaves and use staking.",
      riceTitle: "Rice / Paddy crop care",
      riceText:
        "Maintain proper water level, check stem borer, and monitor blast disease after humid weather.",
      chilliTitle: "Chilli crop care",
      chilliText:
        "Watch for thrips, mites and leaf curl. Use yellow sticky traps and avoid over-irrigation.",
      onionTitle: "Onion crop care",
      onionText:
        "Check thrips and purple blotch. Keep field weed-free and avoid excess moisture.",
      cottonTitle: "Cotton crop care",
      cottonText:
        "Monitor pink bollworm and sucking pests. Use pheromone traps and rotate sprays carefully.",
      maizeTitle: "Maize crop care",
      maizeText:
        "Watch fall armyworm, maintain proper spacing, and apply nutrients at knee-height and tasseling stages.",
      defaultTitle: "Crop care",
      defaultText:
        "Monitor pest symptoms, compare market prices before selling, and keep crop quality graded.",
    },
  },

  te: {
    appTitle: "నా పంటల జాబితా",
    subtitle: "పంటలు, ధరలు, నాణ్యత మరియు పంట డ్యాష్‌బోర్డ్ నిర్వహణ",
    dashboard: "డ్యాష్‌బోర్డ్",
    addCrop: "పంట జోడించండి",
    addNewListing: "కొత్త పంట జోడించండి",
    exportReport: "రిపోర్ట్ డౌన్‌లోడ్",
    heroSmall: "రైతు పంట నిర్వహణ కేంద్రం",
    heroTitle: "మీ పంటలను వ్యాపారంలా సులభంగా నిర్వహించండి",
    heroDesc:
      "పంట పరిమాణం, అమ్మకపు ధర, అంచనా విలువ, మార్కెట్ సిద్ధత మరియు పంటకు సంబంధించిన సూచనలు ఒకే చోట చూడండి.",
    totalListings: "మొత్తం పంటలు",
    totalQuantity: "మొత్తం పరిమాణం",
    estimatedValue: "అంచనా విలువ",
    averagePrice: "సగటు ధర",
    searchPlaceholder: "పంట, ప్రదేశం, రైతు పేరు, వివరాలతో వెతకండి...",
    latestFirst: "కొత్తవి ముందుగా",
    priceHigh: "ధర ఎక్కువ నుండి తక్కువ",
    priceLow: "ధర తక్కువ నుండి ఎక్కువ",
    quantityHigh: "పరిమాణం ఎక్కువ నుండి తక్కువ",
    cropNameAZ: "పంట పేరు A-Z",
    gridView: "కార్డ్ వీక్షణ",
    tableView: "టేబుల్ వీక్షణ",
    refresh: "రిఫ్రెష్",
    listings: "పంటలు",
    inventory: "నిల్వ",
    value: "విలువ",
    avgPrice: "సగటు ధర",
    noCrops: "పంటలు లేవు",
    noCropsDesc: "మొదటి పంటను జోడించండి లేదా సెర్చ్ ఫిల్టర్ మార్చండి.",
    loading: "మీ పంటల వివరాలు లోడ్ అవుతున్నాయి...",
    loginRequired: "లాగిన్ అవసరం",
    loginMessage: "రైతు ID కనిపించలేదు. దయచేసి మళ్లీ లాగిన్ అవ్వండి.",
    goLogin: "లాగిన్‌కు వెళ్ళండి",
    share: "షేర్",
    quantity: "పరిమాణం",
    price: "ధర",
    edit: "ఎడిట్",
    delete: "డిలీట్",
    comparePrice: "ధర పోల్చండి",
    openDashboard: "డ్యాష్‌బోర్డ్ తెరవండి",
    crop: "పంట",
    farmer: "రైతు",
    location: "ప్రదేశం",
    actions: "చర్యలు",
    view: "చూడండి",
    cropId: "పంట ID",
    listingDetails: "పంట వివరాలు",
    editCrop: "పంట ఎడిట్ చేయండి",
    editSubtitle: "పంట వివరాలు మరియు ధరలను మార్చండి.",
    cropName: "పంట పేరు",
    quantityKg: "పరిమాణం KG",
    priceKg: "ధర / KG",
    description: "వివరణ",
    cancel: "రద్దు",
    updateCrop: "పంట అప్డేట్ చేయండి",
    noDescription: "ఈ పంటకు వివరాలు లేవు.",
    noDescriptionAvailable: "వివరణ అందుబాటులో లేదు.",
    noLocation: "ప్రదేశం జోడించలేదు",
    notAvailable: "అందుబాటులో లేదు",
    confirmDelete: "ఈ పంటను డిలీట్ చేయాలనుకుంటున్నారా?",
    deleteSuccess: "పంట విజయవంతంగా డిలీట్ అయింది",
    deleteFailed: "డిలీట్ విఫలమైంది",
    updateSuccess: "పంట విజయవంతంగా అప్డేట్ అయింది",
    updateFailed: "అప్డేట్ విఫలమైంది",
    copied: "పంట వివరాలు కాపీ అయ్యాయి",
    noExport: "ఎగుమతి చేయడానికి పంటలు లేవు",
    languageButton: "English",
    status: {
      bulk: "పెద్ద పరిమాణం",
      premium: "మంచి ధర",
      lowStock: "తక్కువ నిల్వ",
      ready: "అమ్మడానికి సిద్ధం",
    },
    tips: {
      tomatoTitle: "టమోటా పంట జాగ్రత్తలు",
      tomatoText:
        "ఆకు ముడత, ఎర్లీ బ్లైట్ మరియు ఫ్రూట్ బోరర్‌ను గమనించండి. ఆకులపై నీరు పడకుండా చూసుకోండి.",
      riceTitle: "వరి పంట జాగ్రత్తలు",
      riceText:
        "నీటి మట్టం సరిగా ఉంచండి. స్టెమ్ బోరర్ మరియు తేమ తర్వాత వచ్చే బ్లాస్ట్ వ్యాధిని గమనించండి.",
      chilliTitle: "మిర్చి పంట జాగ్రత్తలు",
      chilliText:
        "త్రిప్స్, మైట్స్ మరియు ఆకు ముడతను గమనించండి. యెల్లో స్టికీ ట్రాప్స్ ఉపయోగించండి.",
      onionTitle: "ఉల్లి పంట జాగ్రత్తలు",
      onionText:
        "త్రిప్స్ మరియు పర్పుల్ బ్లాచ్‌ను గమనించండి. పొలాన్ని కలుపు లేకుండా ఉంచండి.",
      cottonTitle: "పత్తి పంట జాగ్రత్తలు",
      cottonText:
        "పింక్ బోల్‌వార్మ్ మరియు సక్కింగ్ పెస్ట్స్‌ను గమనించండి. ఫెరోమోన్ ట్రాప్స్ ఉపయోగించండి.",
      maizeTitle: "మొక్కజొన్న పంట జాగ్రత్తలు",
      maizeText:
        "ఫాల్ ఆర్మీవార్మ్‌ను గమనించండి. సరైన దూరం పాటించండి మరియు సరైన దశల్లో ఎరువులు ఇవ్వండి.",
      defaultTitle: "పంట జాగ్రత్తలు",
      defaultText:
        "పురుగు లక్షణాలు గమనించండి, అమ్మే ముందు మార్కెట్ ధరలు పోల్చండి, పంట నాణ్యతను గ్రేడ్ చేయండి.",
    },
  },
};

const cropImages = {
  tomato:
    "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?q=80&w=1200&auto=format&fit=crop",
  rice:
    "https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=1200&auto=format&fit=crop",
  paddy:
    "https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=1200&auto=format&fit=crop",
  onion:
    "https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?q=80&w=1200&auto=format&fit=crop",
  chilli:
    "https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?q=80&w=1200&auto=format&fit=crop",
  cotton:
    "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?q=80&w=1200&auto=format&fit=crop",
  maize:
    "https://images.unsplash.com/photo-1551754655-cd27e38d2076?q=80&w=1200&auto=format&fit=crop",
  corn:
    "https://images.unsplash.com/photo-1551754655-cd27e38d2076?q=80&w=1200&auto=format&fit=crop",
  wheat:
    "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=1200&auto=format&fit=crop",
};

function MyCrops() {
  const navigate = useNavigate();
  const farmerId = localStorage.getItem("farmerId");

  const [lang, setLang] = useState(localStorage.getItem("appLang") || "en");
  const t = TEXT[lang];

  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editCrop, setEditCrop] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    fetchCrops();
  }, []);

  const changeLanguage = () => {
    const nextLang = lang === "en" ? "te" : "en";
    setLang(nextLang);
    localStorage.setItem("appLang", nextLang);
  };

  const fetchCrops = async () => {
    if (!farmerId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/farmer/${farmerId}`);
      setCrops(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.log("FETCH CROPS ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  const normalize = (value) => String(value || "").toLowerCase().trim();

  const openCropDashboard = (crop) => {
    navigate(`/crop-dashboard/${crop.cropId}`, {
      state: { crop },
    });
  };

  const getCropImage = (crop) => {
    if (crop.imageUrl) return crop.imageUrl;

    const name = normalize(crop.cropName);
    const key = Object.keys(cropImages).find((item) => name.includes(item));

    return (
      cropImages[key] ||
      "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1200&auto=format&fit=crop"
    );
  };

  const getCropTip = (name) => {
    const crop = normalize(name);

    if (crop.includes("tomato")) {
      return {
        title: t.tips.tomatoTitle,
        text: t.tips.tomatoText,
      };
    }

    if (crop.includes("rice") || crop.includes("paddy")) {
      return {
        title: t.tips.riceTitle,
        text: t.tips.riceText,
      };
    }

    if (crop.includes("chilli")) {
      return {
        title: t.tips.chilliTitle,
        text: t.tips.chilliText,
      };
    }

    if (crop.includes("onion")) {
      return {
        title: t.tips.onionTitle,
        text: t.tips.onionText,
      };
    }

    if (crop.includes("cotton")) {
      return {
        title: t.tips.cottonTitle,
        text: t.tips.cottonText,
      };
    }

    if (crop.includes("maize") || crop.includes("corn")) {
      return {
        title: t.tips.maizeTitle,
        text: t.tips.maizeText,
      };
    }

    return {
      title: t.tips.defaultTitle,
      text: t.tips.defaultText,
    };
  };

  const getListingStatus = (crop) => {
    const qty = Number(crop.quantity || 0);
    const price = Number(crop.price || 0);

    if (qty >= 1000) {
      return {
        label: t.status.bulk,
        className: "bg-blue-100 text-blue-700",
      };
    }

    if (price >= 50) {
      return {
        label: t.status.premium,
        className: "bg-purple-100 text-purple-700",
      };
    }

    if (qty <= 100) {
      return {
        label: t.status.lowStock,
        className: "bg-orange-100 text-orange-700",
      };
    }

    return {
      label: t.status.ready,
      className: "bg-green-100 text-green-700",
    };
  };

  const filteredCrops = useMemo(() => {
    let list = [...crops];

    if (searchText.trim()) {
      const key = normalize(searchText);

      list = list.filter((crop) => {
        return (
          normalize(crop.cropName).includes(key) ||
          normalize(crop.location).includes(key) ||
          normalize(crop.farmerName).includes(key) ||
          normalize(crop.description).includes(key)
        );
      });
    }

    list.sort((a, b) => {
      if (sortBy === "priceHigh") {
        return Number(b.price || 0) - Number(a.price || 0);
      }

      if (sortBy === "priceLow") {
        return Number(a.price || 0) - Number(b.price || 0);
      }

      if (sortBy === "quantityHigh") {
        return Number(b.quantity || 0) - Number(a.quantity || 0);
      }

      if (sortBy === "name") {
        return String(a.cropName || "").localeCompare(String(b.cropName || ""));
      }

      return Number(b.cropId || 0) - Number(a.cropId || 0);
    });

    return list;
  }, [crops, searchText, sortBy]);

  const stats = useMemo(() => {
    const totalCrops = crops.length;

    const totalQuantity = crops.reduce(
      (sum, crop) => sum + Number(crop.quantity || 0),
      0
    );

    const estimatedValue = crops.reduce((sum, crop) => {
      return sum + Number(crop.quantity || 0) * Number(crop.price || 0);
    }, 0);

    const avgPrice =
      crops.length === 0
        ? 0
        : crops.reduce((sum, crop) => sum + Number(crop.price || 0), 0) /
          crops.length;

    return {
      totalCrops,
      totalQuantity,
      estimatedValue,
      avgPrice,
    };
  }, [crops]);

  const handleDelete = async (cropId) => {
    const confirmDelete = window.confirm(t.confirmDelete);
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_URL}/${cropId}`);
      alert(t.deleteSuccess);
      fetchCrops();
    } catch (error) {
      console.log("DELETE ERROR:", error);
      alert(t.deleteFailed);
    }
  };

  const handleEditChange = (e) => {
    setEditCrop({
      ...editCrop,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const updatedCrop = {
        ...editCrop,
        quantity: Number(editCrop.quantity),
        price: Number(editCrop.price),
      };

      await axios.put(`${API_URL}/${editCrop.cropId}`, updatedCrop);

      alert(t.updateSuccess);
      setEditCrop(null);
      fetchCrops();
    } catch (error) {
      console.log("UPDATE ERROR:", error);
      alert(t.updateFailed);
    }
  };

  const shareCrop = async (crop) => {
    const text = `${crop.cropName} - ${crop.quantity} KG - ₹${crop.price}/kg - ${crop.location}`;

    try {
      await navigator.clipboard.writeText(text);
      alert(t.copied);
    } catch {
      alert(text);
    }
  };

  const exportCSV = () => {
    if (!crops.length) {
      alert(t.noExport);
      return;
    }

    const headers = [
      "Crop ID",
      "Crop Name",
      "Quantity",
      "Price",
      "Estimated Value",
      "Location",
      "Farmer",
      "Description",
    ];

    const rows = crops.map((crop) => [
      crop.cropId,
      crop.cropName,
      crop.quantity,
      crop.price,
      Number(crop.quantity || 0) * Number(crop.price || 0),
      crop.location,
      crop.farmerName,
      crop.description,
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell || ""}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "my-crops.csv";
    a.click();

    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#f4f8f5]">
        <div className="text-center">
          <div className="h-16 w-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <h1 className="text-3xl font-black text-green-700 mt-6">
            {t.loading}
          </h1>
        </div>
      </div>
    );
  }

  if (!farmerId) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#f4f8f5] p-6">
        <div className="bg-white rounded-3xl shadow-xl p-10 text-center max-w-xl">
          <h1 className="text-4xl font-black text-slate-900">
            {t.loginRequired}
          </h1>

          <p className="text-slate-500 mt-4">{t.loginMessage}</p>

          <button
            onClick={() => navigate("/login")}
            className="bg-green-600 text-white px-8 py-4 rounded-2xl font-bold mt-8"
          >
            {t.goLogin}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f8f5] text-slate-900">
      <nav className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-[88px] flex items-center justify-between">
          <div
            className="flex items-center gap-4 cursor-pointer"
            onClick={() => navigate("/my-crops")}
          >
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-green-600 to-emerald-400 flex items-center justify-center shadow-lg">
              <span className="text-3xl">🌾</span>
            </div>

            <div>
              <h1 className="text-3xl font-black tracking-tight">
                {t.appTitle}
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
              {t.dashboard}
            </button>

            <button
              onClick={() => navigate("/upload")}
              className="bg-green-600 text-white px-5 py-3 rounded-xl font-bold"
            >
              {t.addCrop}
            </button>
          </div>
        </div>
      </nav>

      <section className="bg-gradient-to-br from-green-900 via-green-700 to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-14 grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
          <div>
            <p className="font-bold text-green-100 mb-4">{t.heroSmall}</p>

            <h2 className="text-5xl lg:text-6xl font-black leading-tight">
              {t.heroTitle}
            </h2>

            <p className="text-green-50 text-lg leading-8 mt-6 max-w-3xl">
              {t.heroDesc}
            </p>

            <div className="flex flex-wrap gap-4 mt-8">
              <button
                onClick={() => navigate("/upload")}
                className="bg-white text-green-700 px-7 py-4 rounded-2xl font-black"
              >
                {t.addNewListing}
              </button>

              <button
                onClick={exportCSV}
                className="bg-white/15 border border-white/30 text-white px-7 py-4 rounded-2xl font-black"
              >
                {t.exportReport}
              </button>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <HeroMetric title={t.totalListings} value={stats.totalCrops} />
            <HeroMetric
              title={t.totalQuantity}
              value={`${stats.totalQuantity.toLocaleString()} KG`}
            />
            <HeroMetric
              title={t.estimatedValue}
              value={`₹${stats.estimatedValue.toLocaleString()}`}
            />
            <HeroMetric
              title={t.averagePrice}
              value={`₹${stats.avgPrice.toFixed(2)}/kg`}
            />
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 p-6 -mt-20 relative z-10">
          <div className="grid md:grid-cols-[1fr_220px_160px_150px] gap-4">
            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="input"
            />

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input"
            >
              <option value="latest">{t.latestFirst}</option>
              <option value="priceHigh">{t.priceHigh}</option>
              <option value="priceLow">{t.priceLow}</option>
              <option value="quantityHigh">{t.quantityHigh}</option>
              <option value="name">{t.cropNameAZ}</option>
            </select>

            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              className="input"
            >
              <option value="grid">{t.gridView}</option>
              <option value="table">{t.tableView}</option>
            </select>

            <button
              onClick={fetchCrops}
              className="bg-green-600 text-white rounded-2xl font-black"
            >
              {t.refresh}
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mt-8">
          <Metric title={t.listings} value={filteredCrops.length} />
          <Metric
            title={t.inventory}
            value={`${stats.totalQuantity.toLocaleString()} KG`}
          />
          <Metric
            title={t.value}
            value={`₹${stats.estimatedValue.toLocaleString()}`}
          />
          <Metric title={t.avgPrice} value={`₹${stats.avgPrice.toFixed(2)}`} />
        </div>

        {filteredCrops.length === 0 ? (
          <div className="bg-white rounded-[2rem] shadow-xl text-center p-14 mt-8">
            <div className="text-7xl mb-5">🌱</div>

            <h2 className="text-4xl font-black text-slate-900">
              {t.noCrops}
            </h2>

            <p className="text-slate-500 mt-4">{t.noCropsDesc}</p>

            <button
              onClick={() => navigate("/upload")}
              className="bg-green-600 text-white px-8 py-4 rounded-2xl font-bold mt-8"
            >
              {t.addCrop}
            </button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {filteredCrops.map((crop) => (
              <CropCard
                key={crop.cropId}
                crop={crop}
                image={getCropImage(crop)}
                status={getListingStatus(crop)}
                tip={getCropTip(crop.cropName)}
                t={t}
                onDashboard={() => openCropDashboard(crop)}
                onEdit={() => setEditCrop(crop)}
                onDelete={() => handleDelete(crop.cropId)}
                onShare={() => shareCrop(crop)}
              />
            ))}
          </div>
        ) : (
          <CropTable
            crops={filteredCrops}
            t={t}
            onDashboard={openCropDashboard}
            onEdit={setEditCrop}
            onDelete={handleDelete}
            onQuickView={setSelectedCrop}
          />
        )}
      </main>

      {editCrop && (
        <EditCropModal
          editCrop={editCrop}
          t={t}
          onChange={handleEditChange}
          onClose={() => setEditCrop(null)}
          onSubmit={handleUpdate}
        />
      )}

      {selectedCrop && (
        <CropDetailsModal
          crop={selectedCrop}
          image={getCropImage(selectedCrop)}
          status={getListingStatus(selectedCrop)}
          tip={getCropTip(selectedCrop.cropName)}
          t={t}
          onClose={() => setSelectedCrop(null)}
          onDashboard={() => openCropDashboard(selectedCrop)}
        />
      )}

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

function CropCard({
  crop,
  image,
  status,
  tip,
  t,
  onDashboard,
  onEdit,
  onDelete,
  onShare,
}) {
  const value = Number(crop.quantity || 0) * Number(crop.price || 0);

  return (
    <div className="bg-white rounded-[2rem] overflow-hidden shadow-xl border border-slate-100 hover:-translate-y-1 transition">
      <div className="relative">
        <img
          src={image}
          alt={crop.cropName}
          className="h-64 w-full object-cover"
        />

        <span
          className={`absolute top-4 left-4 px-4 py-2 rounded-full font-black ${status.className}`}
        >
          {status.label}
        </span>

        <span className="absolute top-4 right-4 bg-white text-green-700 px-4 py-2 rounded-full font-black">
          ₹{crop.price}/kg
        </span>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start gap-3">
          <div>
            <h2 className="text-3xl font-black text-slate-900">
              {crop.cropName}
            </h2>
            <p className="text-slate-500 mt-1">
              {crop.location || t.noLocation}
            </p>
          </div>

          <button
            type="button"
            onClick={onShare}
            className="bg-slate-100 text-slate-700 px-3 py-2 rounded-xl font-bold"
          >
            {t.share}
          </button>
        </div>


        <div className="grid grid-cols-2 gap-4 mt-5">
          <MiniStat label={t.quantity} value={`${crop.quantity} KG`} />
          <MiniStat label={t.value} value={`₹${value.toLocaleString()}`} />
        </div>

        <div className="bg-green-50 rounded-2xl p-4 mt-5">
          <p className="font-black text-green-700">{tip.title}</p>
          <p className="text-sm text-slate-600 mt-1">{tip.text}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-6">
          <button
            type="button"
            onClick={onDashboard}
            className="bg-slate-900 text-white py-3 rounded-xl font-bold"
          >
            {t.dashboard}
          </button>

          <button
            type="button"
            onClick={onEdit}
            className="bg-blue-600 text-white py-3 rounded-xl font-bold"
          >
            {t.edit}
          </button>

          <button
            type="button"
            onClick={() => (window.location.href = "/farming-products")}
            className="bg-green-600 text-white py-3 rounded-xl font-bold"
          >
            {t.price}
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="bg-red-600 text-white py-3 rounded-xl font-bold"
          >
            {t.delete}
          </button>
        </div>
      </div>
    </div>
  );
}

function CropTable({ crops, t, onDashboard, onEdit, onDelete, onQuickView }) {
  return (
    <div className="bg-white rounded-[2rem] shadow-xl border overflow-x-auto mt-8">
      <table className="w-full min-w-[1100px]">
        <thead className="bg-slate-900 text-white text-left">
          <tr>
            <th className="p-5">{t.crop}</th>
            <th className="p-5">{t.quantity}</th>
            <th className="p-5">{t.price}</th>
            <th className="p-5">{t.value}</th>
            <th className="p-5">{t.location}</th>
            <th className="p-5">{t.farmer}</th>
            <th className="p-5">{t.actions}</th>
          </tr>
        </thead>

        <tbody>
          {crops.map((crop) => {
            const value = Number(crop.quantity || 0) * Number(crop.price || 0);

            return (
              <tr key={crop.cropId} className="border-b hover:bg-green-50">
                <td className="p-5 font-black text-green-700">
                  {crop.cropName}
                </td>
                <td className="p-5">{crop.quantity} KG</td>
                <td className="p-5">₹{crop.price}/kg</td>
                <td className="p-5 font-black">₹{value.toLocaleString()}</td>
                <td className="p-5">{crop.location}</td>
                <td className="p-5">{crop.farmerName}</td>
                <td className="p-5">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => onDashboard(crop)}
                      className="bg-slate-900 text-white px-4 py-2 rounded-xl"
                    >
                      {t.dashboard}
                    </button>

                    <button
                      type="button"
                      onClick={() => onQuickView(crop)}
                      className="bg-green-600 text-white px-4 py-2 rounded-xl"
                    >
                      {t.view}
                    </button>

                    <button
                      type="button"
                      onClick={() => onEdit(crop)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-xl"
                    >
                      {t.edit}
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(crop.cropId)}
                      className="bg-red-600 text-white px-4 py-2 rounded-xl"
                    >
                      {t.delete}
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function EditCropModal({ editCrop, t, onChange, onClose, onSubmit }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center p-5 z-50">
      <form
        onSubmit={onSubmit}
        className="bg-white rounded-[2rem] shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-4xl font-black text-slate-900">
              {t.editCrop}
            </h2>
            <p className="text-slate-500 mt-1">{t.editSubtitle}</p>
          </div>

          <button type="button" onClick={onClose} className="text-2xl font-black">
            ×
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Input
            name="cropName"
            label={t.cropName}
            value={editCrop.cropName}
            onChange={onChange}
            required
          />
          <Input
            name="quantity"
            label={t.quantityKg}
            type="number"
            value={editCrop.quantity}
            onChange={onChange}
            required
          />
          <Input
            name="price"
            label={t.priceKg}
            type="number"
            value={editCrop.price}
            onChange={onChange}
            required
          />
          <Input
            name="location"
            label={t.location}
            value={editCrop.location}
            onChange={onChange}
            required
          />
        </div>

        <div className="mt-4">
          <label className="block font-black text-slate-700 mb-2">
            {t.description}
          </label>
          <textarea
            name="description"
            value={editCrop.description || ""}
            onChange={onChange}
            className="input min-h-[120px]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="bg-slate-100 text-slate-800 py-4 rounded-2xl font-black"
          >
            {t.cancel}
          </button>

          <button
            type="submit"
            className="bg-green-600 text-white py-4 rounded-2xl font-black"
          >
            {t.updateCrop}
          </button>
        </div>
      </form>
    </div>
  );
}

function CropDetailsModal({
  crop,
  image,
  status,
  tip,
  t,
  onClose,
  onDashboard,
}) {
  const value = Number(crop.quantity || 0) * Number(crop.price || 0);

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center p-5 z-50">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <img
          src={image}
          alt={crop.cropName}
          className="h-80 w-full object-cover rounded-t-[2rem]"
        />

        <div className="p-8">
          <div className="flex justify-between gap-5">
            <div>
              <span
                className={`inline-block px-4 py-2 rounded-full font-black ${status.className}`}
              >
                {status.label}
              </span>

              <h2 className="text-5xl font-black text-slate-900 mt-4">
                {crop.cropName}
              </h2>

              <p className="text-slate-500 mt-2">{crop.location}</p>
            </div>

            <button onClick={onClose} className="text-3xl font-black h-12 w-12">
              ×
            </button>
          </div>

          <div className="grid md:grid-cols-4 gap-5 mt-8">
            <MiniStat label={t.quantity} value={`${crop.quantity} KG`} />
            <MiniStat label={t.price} value={`₹${crop.price}/kg`} />
            <MiniStat label={t.value} value={`₹${value.toLocaleString()}`} />
            <MiniStat label={t.cropId} value={crop.cropId} />
          </div>

          <div className="grid md:grid-cols-2 gap-5 mt-8">
            <div className="bg-slate-50 rounded-3xl p-6">
              <h3 className="text-2xl font-black text-slate-900">
                {t.listingDetails}
              </h3>

              <p className="text-slate-600 mt-4 leading-7 whitespace-pre-wrap">
                {crop.description || t.noDescriptionAvailable}
              </p>

              <p className="mt-4">
                <b>{t.farmer}:</b> {crop.farmerName || t.notAvailable}
              </p>
            </div>

            <div className="bg-green-50 rounded-3xl p-6">
              <h3 className="text-2xl font-black text-green-700">
                {tip.title}
              </h3>

              <p className="text-slate-600 mt-4 leading-7">{tip.text}</p>

              <button
                type="button"
                onClick={onDashboard}
                className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold mt-5 mr-3"
              >
                {t.openDashboard}
              </button>

              <button
                type="button"
                onClick={() => (window.location.href = "/farming-products")}
                className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold mt-5"
              >
                {t.comparePrice}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroMetric({ title, value }) {
  return (
    <div className="bg-white text-slate-900 rounded-3xl p-6 shadow-lg">
      <p className="text-slate-500 font-bold">{title}</p>
      <h3 className="text-3xl font-black text-green-700 mt-2">{value}</h3>
    </div>
  );
}

function Metric({ title, value }) {
  return (
    <div className="bg-white rounded-3xl p-7 shadow-lg border border-slate-100">
      <p className="text-slate-500 font-bold">{title}</p>
      <h3 className="text-3xl font-black text-green-700 mt-2">{value}</h3>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="bg-slate-50 rounded-2xl p-4">
      <p className="text-slate-500 text-sm font-bold">{label}</p>
      <h4 className="text-lg font-black text-slate-900 mt-1">{value}</h4>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="block font-black text-slate-700 mb-2">{label}</label>
      <input {...props} className="input" />
    </div>
  );
}

export default MyCrops;