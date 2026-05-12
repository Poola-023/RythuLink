export default function RythuLinkHomeDemo() {
  const sections = [
    {
      title: "Smart Marketplace",
      desc: "Buy and sell crops directly from farmers with real-time pricing.",
      icon: "🌾",
    },
    {
      title: "AI Crop Analysis",
      desc: "AI-powered crop recommendations and disease prediction.",
      icon: "🤖",
    },
    {
      title: "Farmer Network",
      desc: "Connect farmers, buyers, transporters and exporters.",
      icon: "🚜",
    },
    {
      title: "Weather Alerts",
      desc: "Village-level weather forecasting and alerts.",
      icon: "⛅",
    },
    {
      title: "Export Opportunities",
      desc: "Help farmers export crops globally.",
      icon: "🌍",
    },
    {
      title: "Secure Payments",
      desc: "Fast and secure digital transactions.",
      icon: "💳",
    },
  ];

  const crops = [
    {
      name: "Tomato",
      price: "₹18/kg",
      image:
        "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "Rice",
      price: "₹42/kg",
      image:
        "https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "Corn",
      price: "₹28/kg",
      image:
        "https://images.unsplash.com/photo-1551754655-cd27e38d2076?q=80&w=1200&auto=format&fit=crop",
    },
  ];

  const testimonials = [
    {
      name: "Ravi Kumar",
      role: "Farmer",
      text: "I sold crops directly to buyers and increased my profits.",
    },
    {
      name: "Lakshmi",
      role: "Buyer",
      text: "Fresh crops and direct farmer communication is amazing.",
    },
    {
      name: "Suresh",
      role: "Exporter",
      text: "This platform simplified crop sourcing for exports.",
    },
  ];

  return (
    <div className="bg-green-50 min-h-screen text-gray-800">
      {/* NAVBAR */}


      <nav className="bg-white/95 backdrop-blur-md shadow-md sticky top-0 z-50 border-b border-gray-100">

        <div className="max-w-7xl mx-auto px-6 lg:px-10">

          <div className="h-[88px] flex items-center justify-between">

            {/* LEFT LOGO */}

            <div
              className="flex items-center gap-4 cursor-pointer min-w-fit"
              onClick={() => window.location.href = "/"}
            >

              {/* LOGO ICON */}

              <div className="h-14 w-14 bg-green-600 rounded-2xl flex items-center justify-center shadow-lg shrink-0">

                <span className="text-3xl">
                  🌱
                </span>

              </div>

              {/* LOGO TEXT */}

              <div className="leading-tight">

                <h1 className="text-3xl font-extrabold text-green-700 whitespace-nowrap">

                  RythuLink AI

                </h1>

                <p className="text-sm text-gray-500">

                  Smart Agriculture Platform

                </p>

              </div>

            </div>

            {/* CENTER LINKS */}

            <div className="hidden lg:flex items-center gap-8">

              <a
                href="#home"
                className="text-[16px] font-semibold text-gray-700 hover:text-green-700 transition"
              >
                Home
              </a>

              <a
                href="#features"
                className="text-[16px] font-semibold text-gray-700 hover:text-green-700 transition"
              >
                Features
              </a>

              <a
                href="#marketplace"
                className="text-[16px] font-semibold text-gray-700 hover:text-green-700 transition"
              >
                Marketplace
              </a>

              <a
                href="#analytics"
                className="text-[16px] font-semibold text-gray-700 hover:text-green-700 transition"
              >
                Analytics
              </a>

              <a
                href="#farmers"
                className="text-[16px] font-semibold text-gray-700 hover:text-green-700 transition"
              >
                Farmers
              </a>

              <a
                href="#contact"
                className="text-[16px] font-semibold text-gray-700 hover:text-green-700 transition"
              >
                Contact
              </a>

            </div>

            {/* RIGHT SECTION */}

            <div className="flex items-center gap-4">


              {/* BUTTONS */}

              <button
                onClick={() => window.location.href = "/login"}
                className="bg-green-600 hover:bg-green-700 text-white px-5 h-12 rounded-xl font-semibold shadow-md transition"
              >
                Farmer Login
              </button>

              <button
                onClick={() => window.location.href = "/buyer-login"}
                className="bg-orange-500 hover:bg-orange-600 text-white px-5 h-12 rounded-xl font-semibold shadow-md transition"
              >
                Buyer Login
              </button>

              <button
                onClick={() => window.location.href = "/admin-login"}
                className="bg-gray-900 hover:bg-black text-white px-5 h-12 rounded-xl font-semibold shadow-md transition"
              >
                Admin
              </button>

            </div>

          </div>

        </div>

      </nav>

      {/* HERO SECTION */}
      <section
        id="home"
        className="max-w-7xl mx-auto px-6 py-28 grid lg:grid-cols-2 gap-14 items-center"
      >
        <div>
          <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight text-green-800">
            Smart Agriculture Marketplace For Modern Farmers
          </h1>

          <p className="text-xl text-gray-600 mt-8 leading-8">
            RythuLink AI helps farmers sell crops directly to buyers,
            analyze market trends, detect crop diseases and maximize profits
            using artificial intelligence.
          </p>

          <div className="flex flex-wrap gap-5 mt-10">
            <button className="bg-green-600 text-white px-8 py-4 rounded-2xl text-lg hover:bg-green-700 shadow-lg">
              Start Selling
            </button>

            <button className="bg-white border border-green-600 text-green-700 px-8 py-4 rounded-2xl text-lg hover:bg-green-100 shadow-lg">
              Explore Marketplace
            </button>
          </div>
        </div>

        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1600&auto=format&fit=crop"
            alt="Farmer"
            className="rounded-3xl shadow-2xl h-[550px] w-full object-cover"
          />

          <div className="absolute bottom-6 left-6 bg-white p-6 rounded-2xl shadow-xl">
            <h2 className="text-3xl font-bold text-green-700">10K+</h2>
            <p className="text-gray-600">Active Farmers</p>
          </div>
        </div>
      </section>
      {/* QUICK STATS */}

      <section className="bg-green-700 py-10">

        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 text-center text-white">

          <div>

            <h2 className="text-5xl font-extrabold">
              15K+
            </h2>

            <p className="mt-3 text-lg">
              Registered Farmers
            </p>

          </div>

          <div>

            <h2 className="text-5xl font-extrabold">
              50K+
            </h2>

            <p className="mt-3 text-lg">
              Crop Listings
            </p>

          </div>

          <div>

            <h2 className="text-5xl font-extrabold">
              ₹12Cr+
            </h2>

            <p className="mt-3 text-lg">
              Transactions
            </p>

          </div>

          <div>

            <h2 className="text-5xl font-extrabold">
              120+
            </h2>

            <p className="mt-3 text-lg">
              District Coverage
            </p>

          </div>

        </div>

      </section>

      {/* FEATURES */}
      <section id="features" className="bg-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-green-700">
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

      {/* MARKETPLACE */}
      <section id="marketplace" className="py-20 px-6 bg-green-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-5xl font-bold text-green-700">
                Trending Crops
              </h2>
              <p className="text-gray-600 mt-4 text-lg">
                Fresh crops directly from farmers.
              </p>
            </div>

            <button className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700">
              View All Crops
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {crops.map((crop, index) => (
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
                  <div className="flex justify-between items-center">
                    <h3 className="text-3xl font-bold text-green-700">
                      {crop.name}
                    </h3>

                    <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold">
                      {crop.price}
                    </span>
                  </div>

                  <p className="text-gray-600 mt-5 leading-7">
                    Premium quality crops available directly from verified farmers.
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

      {/* ANALYTICS SECTION */}
      <section id="analytics" className="bg-white py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-green-700">
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

      {/* FARMERS SECTION */}
      <section id="farmers" className="py-20 px-6 bg-green-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-green-700">
              Trusted By Farmers
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((item, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-3xl shadow-xl"
              >
                <div className="text-5xl mb-5">👨‍🌾</div>

                <p className="text-gray-600 text-lg leading-8">
                  “{item.text}”
                </p>

                <div className="mt-8">
                  <h3 className="text-2xl font-bold text-green-700">
                    {item.name}
                  </h3>

                  <p className="text-gray-500 mt-2">
                    {item.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="bg-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-green-700">
            Join The Agriculture Revolution
          </h2>

          <p className="text-gray-600 text-xl mt-6 leading-8">
            Empowering farmers with AI and digital agriculture technology.
          </p>

          <div className="flex flex-wrap justify-center gap-5 mt-10">
            <button className="bg-green-600 text-white px-10 py-4 rounded-2xl text-lg hover:bg-green-700 shadow-lg">
              Farmer Register
            </button>

            <button className="bg-orange-500 text-white px-10 py-4 rounded-2xl text-lg hover:bg-orange-600 shadow-lg">
              Buyer Register
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-green-800 text-white py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-5">
          <div>
            <h2 className="text-3xl font-bold">
              RythuLink AI 🌱
            </h2>
            <p className="mt-3 text-green-100">
              Smart Farming • AI Marketplace • Digital Agriculture
            </p>
          </div>

          <div className="flex gap-6 text-lg">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Support</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
