import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const TEXT = {
  en: {
    appName: "RythuLink AI",
    pageTitle: "Farmer Command Center",
    pageSubtitle: "Smart agriculture, crop selling, planning and advisory dashboard",
    welcome: "Welcome back",
    farmerId: "Farmer ID",
    languageButton: "తెలుగు",
    logout: "Logout",
    liveTime: "Live Time",
    todayFocus: "Today’s Farming Focus",
    todayFocusDesc:
      "Start with your crop health, market price, orders and farming plans.",
    uploadCrop: "Upload New Crop",
    controlCenter: "Farm Management Hub",
    controlDesc:
      "Manage crops, prices, orders, weather, AI advisory, transport and advanced crop planning from one professional dashboard.",
    quickActions: "Quick Actions",
    professionalTools: "Professional Farming Tools",
    open: "Open",
    status: {
      uploadedCrops: "Uploaded Crops",
      ordersReceived: "Orders Received",
      marketStatus: "Market Status",
      weatherAlerts: "Weather Alerts",
      live: "Live",
      track: "Track",
      active: "Active",
    },
    features: {
      upload: {
        title: "Upload Crop",
        desc: "Add crop name, acres, investment, image and auto-create farming guide.",
      },
      myCrops: {
        title: "My Crops",
        desc: "View your crop portfolio, value, quantity, crop dashboard and selling status.",
      },
      cropKnowledge: {
        title: "Crop Knowledge Center",
        desc: "Start-to-end crop process, health issues, disease control and advanced farming guide.",
      },
      combination: {
        title: "Crop Combination Planner",
        desc: "Choose 2 or 3 crops, enter acres and get land division with risk guidance.",
      },
      orders: {
        title: "Orders",
        desc: "Accept, reject, pack and manage buyer crop orders.",
      },
      marketplace: {
        title: "Marketplace",
        desc: "Explore crop demand, buyers, mandi prices and selling opportunities.",
      },
      farmingProducts: {
        title: "Live Farming Prices",
        desc: "Check rice, vegetables, pulses, spices, fruits and mandi price intelligence.",
      },
      weather: {
        title: "Weather",
        desc: "Live weather updates and farming alerts for your location.",
      },
      aiAdvisor: {
        title: "AI Advisor",
        desc: "AI-based crop suggestions, disease guidance and farming advice.",
      },
      transport: {
        title: "Transport",
        desc: "Arrange crop transportation and delivery logistics.",
      },
      payments: {
        title: "Payments",
        desc: "Track earnings, invoices and completed crop payments.",
      },
      exportMarket: {
        title: "Export Market",
        desc: "Find export buyers and bulk crop opportunities.",
      },
    },
    priority: {
      title: "Recommended workflow",
      one: "1. Upload crop with acres and investment",
      two: "2. Open crop dashboard and follow growth-stage guide",
      three: "3. Compare live market price before selling",
      four: "4. Use crop combination planner for next season",
    },
  },

  te: {
    appName: "రైతు లింక్ AI",
    pageTitle: "రైతు కమాండ్ సెంటర్",
    pageSubtitle: "స్మార్ట్ వ్యవసాయం, పంట అమ్మకం, ప్రణాళిక మరియు సలహా డ్యాష్‌బోర్డ్",
    welcome: "మళ్లీ స్వాగతం",
    farmerId: "రైతు ID",
    languageButton: "English",
    logout: "లాగౌట్",
    liveTime: "ప్రస్తుత సమయం",
    todayFocus: "ఈరోజు వ్యవసాయ దృష్టి",
    todayFocusDesc:
      "ముందుగా పంట ఆరోగ్యం, మార్కెట్ ధర, ఆర్డర్లు మరియు వ్యవసాయ ప్రణాళికలు చూడండి.",
    uploadCrop: "కొత్త పంట జోడించండి",
    controlCenter: "వ్యవసాయ నిర్వహణ కేంద్రం",
    controlDesc:
      "పంటలు, ధరలు, ఆర్డర్లు, వాతావరణం, AI సలహాలు, రవాణా మరియు అధునాతన పంట ప్రణాళికలను ఒకే డ్యాష్‌బోర్డ్‌లో నిర్వహించండి.",
    quickActions: "త్వరిత చర్యలు",
    professionalTools: "ప్రొఫెషనల్ వ్యవసాయ టూల్స్",
    open: "తెరవండి",
    status: {
      uploadedCrops: "జోడించిన పంటలు",
      ordersReceived: "వచ్చిన ఆర్డర్లు",
      marketStatus: "మార్కెట్ స్థితి",
      weatherAlerts: "వాతావరణ హెచ్చరికలు",
      live: "లైవ్",
      track: "ట్రాక్",
      active: "యాక్టివ్",
    },
    features: {
      upload: {
        title: "పంట జోడించండి",
        desc: "పంట పేరు, ఎకరాలు, పెట్టుబడి, చిత్రం జోడించి ఆటోమేటిక్ వ్యవసాయ గైడ్ పొందండి.",
      },
      myCrops: {
        title: "నా పంటలు",
        desc: "మీ పంటల జాబితా, విలువ, పరిమాణం, పంట డ్యాష్‌బోర్డ్ మరియు అమ్మకపు స్థితి చూడండి.",
      },
      cropKnowledge: {
        title: "పంట జ్ఞాన కేంద్రం",
        desc: "పంట ప్రారంభం నుండి చివరి వరకు ప్రక్రియ, ఆరోగ్య సమస్యలు, వ్యాధి నియంత్రణ మరియు ఆధునిక గైడ్.",
      },
      combination: {
        title: "పంటల కలయిక ప్రణాళిక",
        desc: "2 లేదా 3 పంటలు ఎంచుకుని, ఎకరాలు నమోదు చేసి భూమి విభజన మరియు ప్రమాద సూచనలు పొందండి.",
      },
      orders: {
        title: "ఆర్డర్లు",
        desc: "కొనుగోలుదారుల ఆర్డర్లను అంగీకరించండి, తిరస్కరించండి, ప్యాక్ చేసి నిర్వహించండి.",
      },
      marketplace: {
        title: "మార్కెట్‌ప్లేస్",
        desc: "పంట డిమాండ్, కొనుగోలుదారులు, మండీ ధరలు మరియు అమ్మకపు అవకాశాలు చూడండి.",
      },
      farmingProducts: {
        title: "లైవ్ పంట ధరలు",
        desc: "బియ్యం, కూరగాయలు, పప్పులు, మసాలాలు, పండ్లు మరియు మండీ ధరలు చూడండి.",
      },
      weather: {
        title: "వాతావరణం",
        desc: "మీ ప్రాంతానికి లైవ్ వాతావరణం మరియు వ్యవసాయ హెచ్చరికలు.",
      },
      aiAdvisor: {
        title: "AI సలహాదారు",
        desc: "AI ఆధారిత పంట సూచనలు, వ్యాధి మార్గదర్శకం మరియు వ్యవసాయ సలహాలు.",
      },
      transport: {
        title: "రవాణా",
        desc: "పంట రవాణా మరియు డెలివరీ లాజిస్టిక్స్ ఏర్పాటు చేయండి.",
      },
      payments: {
        title: "చెల్లింపులు",
        desc: "ఆదాయం, ఇన్వాయిస్‌లు మరియు పూర్తయిన పంట చెల్లింపులు ట్రాక్ చేయండి.",
      },
      exportMarket: {
        title: "ఎగుమతి మార్కెట్",
        desc: "ఎగుమతి కొనుగోలుదారులు మరియు పెద్ద పరిమాణ పంట అవకాశాలు కనుగొనండి.",
      },
    },
    priority: {
      title: "సూచించిన పనుల క్రమం",
      one: "1. ఎకరాలు మరియు పెట్టుబడితో పంట జోడించండి",
      two: "2. పంట డ్యాష్‌బోర్డ్ తెరిచి దశల వారీ గైడ్ అనుసరించండి",
      three: "3. అమ్మే ముందు లైవ్ మార్కెట్ ధర పోల్చండి",
      four: "4. వచ్చే సీజన్ కోసం పంటల కలయిక ప్రణాళిక వాడండి",
    },
  },
};

function Dashboard() {
  const navigate = useNavigate();

  const farmerName = localStorage.getItem("farmerName") || "Farmer";
  const farmerId = localStorage.getItem("farmerId") || "N/A";

  const [lang, setLang] = useState(localStorage.getItem("appLang") || "en");
  const [currentTime, setCurrentTime] = useState(new Date());

  const t = TEXT[lang];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const changeLanguage = () => {
    const nextLang = lang === "en" ? "te" : "en";
    setLang(nextLang);
    localStorage.setItem("appLang", nextLang);
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const stats = useMemo(
    () => [
      {
        title: t.status.uploadedCrops,
        value: t.status.live,
        icon: "🌾",
        bg: "bg-green-100",
        text: "text-green-700",
      },
      {
        title: t.status.ordersReceived,
        value: t.status.track,
        icon: "📦",
        bg: "bg-orange-100",
        text: "text-orange-600",
      },
      {
        title: t.status.marketStatus,
        value: t.status.active,
        icon: "📈",
        bg: "bg-blue-100",
        text: "text-blue-600",
      },
      {
        title: t.status.weatherAlerts,
        value: t.status.live,
        icon: "⛅",
        bg: "bg-yellow-100",
        text: "text-yellow-700",
      },
    ],
    [t]
  );

  const features = useMemo(
    () => [
      {
        key: "upload",
        title: t.features.upload.title,
        desc: t.features.upload.desc,
        icon: "🌱",
        path: "/upload",
        color: "from-green-500 to-emerald-600",
        badge: "Core",
      },
      {
        key: "myCrops",
        title: t.features.myCrops.title,
        desc: t.features.myCrops.desc,
        icon: "🌾",
        path: "/my-crops",
        color: "from-lime-500 to-green-600",
        badge: "Manage",
      },
      {
        key: "cropKnowledge",
        title: t.features.cropKnowledge.title,
        desc: t.features.cropKnowledge.desc,
        icon: "🧠",
        path: "/crop-knowledge",
        color: "from-emerald-700 to-lime-600",
        badge: "Guide",
      },
      {
        key: "combination",
        title: t.features.combination.title,
        desc: t.features.combination.desc,
        icon: "🧩",
        path: "/crop-combination-planner",
        color: "from-green-700 to-emerald-500",
        badge: "Plan",
      },
      {
        key: "farmingProducts",
        title: t.features.farmingProducts.title,
        desc: t.features.farmingProducts.desc,
        icon: "📊",
        path: "/farming-products",
        color: "from-cyan-600 to-blue-600",
        badge: "Prices",
      },
      {
        key: "orders",
        title: t.features.orders.title,
        desc: t.features.orders.desc,
        icon: "📦",
        path: "/farmer-orders",
        color: "from-orange-500 to-yellow-500",
        badge: "Sales",
      },
      {
        key: "marketplace",
        title: t.features.marketplace.title,
        desc: t.features.marketplace.desc,
        icon: "🛒",
        path: "/marketplace",
        color: "from-teal-500 to-cyan-600",
        badge: "Market",
      },
      {
        key: "weather",
        title: t.features.weather.title,
        desc: t.features.weather.desc,
        icon: "⛅",
        path: "/weather",
        color: "from-blue-500 to-sky-600",
        badge: "Live",
      },
      {
        key: "aiAdvisor",
        title: t.features.aiAdvisor.title,
        desc: t.features.aiAdvisor.desc,
        icon: "🤖",
        path: "/ai-advisor",
        color: "from-purple-500 to-indigo-600",
        badge: "AI",
      },
      {
        key: "transport",
        title: t.features.transport.title,
        desc: t.features.transport.desc,
        icon: "🚛",
        path: "/transport",
        color: "from-red-500 to-orange-600",
        badge: "Logistics",
      },
      {
        key: "payments",
        title: t.features.payments.title,
        desc: t.features.payments.desc,
        icon: "💳",
        path: "/payments",
        color: "from-pink-500 to-rose-600",
        badge: "Money",
      },
      {
        key: "exportMarket",
        title: t.features.exportMarket.title,
        desc: t.features.exportMarket.desc,
        icon: "🌍",
        path: "/export-market",
        color: "from-gray-700 to-gray-900",
        badge: "Export",
      },
    ],
    [t]
  );

  const mainActions = features.slice(0, 4);
  const otherTools = features.slice(4);

  return (
    <div className="min-h-screen bg-[#f4f8f5] text-slate-900">
      {/* TOP NAV */}
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-[88px] flex items-center justify-between">
          <div
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-4 cursor-pointer"
          >
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-green-600 to-emerald-400 flex items-center justify-center shadow-lg">
              <span className="text-3xl">🌱</span>
            </div>

            <div>
              <h1 className="text-3xl font-black tracking-tight">
                {t.appName}
              </h1>
              <p className="text-sm text-slate-500">{t.pageSubtitle}</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={changeLanguage}
              className="bg-orange-100 text-orange-700 px-5 py-3 rounded-xl font-black hover:bg-orange-200 transition"
            >
              {t.languageButton}
            </button>

           

            <button
              onClick={logout}
              className="bg-red-50 text-red-600 px-5 py-3 rounded-xl font-black hover:bg-red-100 transition"
            >
              {t.logout}
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="bg-gradient-to-br from-green-950 via-green-800 to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-14 grid lg:grid-cols-[1.15fr_0.85fr] gap-10 items-center">
          <div>
            <p className="font-bold text-green-100 text-lg">{t.welcome}</p>

            <h2 className="text-5xl lg:text-7xl font-black leading-tight mt-3">
              {farmerName} 👨‍🌾
            </h2>

            <p className="text-green-50 text-lg mt-5">
              {t.farmerId}:{" "}
              <span className="font-black text-white">{farmerId}</span>
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={() => navigate("/upload")}
                className="bg-white text-green-700 px-8 py-4 rounded-2xl font-black shadow-xl hover:bg-green-50 transition"
              >
                + {t.uploadCrop}
              </button>

              <button
                onClick={() => navigate("/my-crops")}
                className="bg-white/15 border border-white/30 text-white px-8 py-4 rounded-2xl font-black hover:bg-white/20 transition"
              >
                {t.features.myCrops.title}
              </button>

              <button
                onClick={() => navigate("/crop-combination-planner")}
                className="bg-white/15 border border-white/30 text-white px-8 py-4 rounded-2xl font-black hover:bg-white/20 transition"
              >
                {t.features.combination.title}
              </button>
            </div>
          </div>

          <div className="bg-white/15 border border-white/20 backdrop-blur rounded-[2rem] p-6 shadow-2xl">
            <div className="bg-white text-slate-900 rounded-3xl p-6">
              <p className="text-slate-500 font-bold">{t.liveTime}</p>
              <h3 className="text-4xl font-black text-green-700 mt-2">
                {currentTime.toLocaleTimeString()}
              </h3>
              <p className="text-slate-500 font-semibold mt-2">
                {currentTime.toLocaleDateString()}
              </p>
            </div>

            <div className="bg-slate-900 text-white rounded-3xl p-6 mt-5">
              <p className="text-green-200 font-black">{t.todayFocus}</p>
              <p className="text-slate-300 leading-7 mt-3">
                {t.todayFocusDesc}
              </p>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* STATS */}
        <section className="grid md:grid-cols-4 gap-6 -mt-20 relative z-10">
          {stats.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 hover:-translate-y-1 transition"
            >
              <div
                className={`h-14 w-14 ${item.bg} ${item.text} rounded-2xl flex items-center justify-center text-3xl mb-5`}
              >
                {item.icon}
              </div>

              <h2 className={`text-4xl font-black ${item.text}`}>
                {item.value}
              </h2>

              <p className="text-slate-500 mt-2 font-bold">{item.title}</p>
            </div>
          ))}
        </section>

        {/* CONTROL CENTER */}
        <section className="bg-white rounded-[2rem] shadow-xl border border-slate-100 p-8 mt-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div>
              <p className="text-green-700 font-black">{t.pageTitle}</p>

              <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mt-2">
                {t.controlCenter}
              </h2>

              <p className="text-slate-600 mt-4 text-lg leading-8 max-w-3xl">
                {t.controlDesc}
              </p>
            </div>

            <div className="bg-green-50 border border-green-100 rounded-3xl p-5 min-w-[280px]">
              <h3 className="text-xl font-black text-green-800">
                {t.priority.title}
              </h3>

              <div className="space-y-3 mt-4 text-slate-700 font-semibold">
                <p>{t.priority.one}</p>
                <p>{t.priority.two}</p>
                <p>{t.priority.three}</p>
                <p>{t.priority.four}</p>
              </div>
            </div>
          </div>
        </section>

        {/* QUICK ACTIONS */}
        <section className="mt-10">
          <div className="flex items-center justify-between gap-5 mb-6">
            <div>
              <h2 className="text-3xl font-black text-slate-900">
                {t.quickActions}
              </h2>
              <p className="text-slate-500 mt-2">
                {lang === "te"
                  ? "రైతు ఎక్కువగా ఉపయోగించే ముఖ్యమైన పనులు"
                  : "Most-used farmer actions for daily work"}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mainActions.map((item) => (
              <FeatureCard
                key={item.key}
                item={item}
                openText={t.open}
                onClick={() => navigate(item.path)}
                compact
              />
            ))}
          </div>
        </section>

        {/* ALL TOOLS */}
        <section className="mt-12">
          <div className="flex items-center justify-between gap-5 mb-6">
            <div>
              <h2 className="text-3xl font-black text-slate-900">
                {t.professionalTools}
              </h2>
              <p className="text-slate-500 mt-2">
                {lang === "te"
                  ? "వ్యవసాయ నిర్వహణ, ధరలు, AI, రవాణా మరియు అమ్మకాల కోసం అన్ని టూల్స్"
                  : "All tools for farm management, prices, AI, transport and selling"}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherTools.map((item) => (
              <FeatureCard
                key={item.key}
                item={item}
                openText={t.open}
                onClick={() => navigate(item.path)}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function FeatureCard({ item, openText, onClick, compact }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group text-left bg-white rounded-[2rem] shadow-lg hover:shadow-2xl border border-slate-100 overflow-hidden cursor-pointer transition duration-300 hover:-translate-y-2 w-full"
    >
      <div className={`h-2 bg-gradient-to-r ${item.color}`} />

      <div className={compact ? "p-6" : "p-8"}>
        <div className="flex justify-between items-start gap-4">
          <div className={compact ? "text-5xl" : "text-6xl"}>{item.icon}</div>

          <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-black">
            {item.badge}
          </span>
        </div>

        <h2
          className={`font-black text-slate-900 group-hover:text-green-700 transition mt-6 ${
            compact ? "text-2xl" : "text-3xl"
          }`}
        >
          {item.title}
        </h2>

        <p
          className={`text-slate-600 mt-4 leading-7 ${
            compact ? "text-base" : "text-lg"
          }`}
        >
          {item.desc}
        </p>

        <div className="flex items-center justify-between mt-6">
          <span className="text-green-700 font-black">{openText}</span>

          <span className="h-11 w-11 rounded-full bg-green-50 text-green-700 flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition">
            ➜
          </span>
        </div>
      </div>
    </button>
  );
}

export default Dashboard;