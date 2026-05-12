import { useNavigate } from "react-router-dom";

function BuyerDashboard() {

    const navigate = useNavigate();

    const logout = () => {

        localStorage.removeItem("token");

        navigate("/");
    };

    return (

        <div className="min-h-screen bg-orange-50">

            {/* HEADER */}

            <div className="bg-white shadow-md px-8 py-5 flex justify-between items-center">

                <div>

                    <h1 className="text-5xl font-extrabold text-orange-500">
                        Buyer Dashboard 🛒
                    </h1>

                    <p className="text-gray-600 mt-2 text-lg">
                        Manage crop purchases and farmer connections
                    </p>

                </div>

                <button
                    onClick={logout}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md"
                >
                    Logout
                </button>

            </div>

            {/* CONTENT */}

            <div className="p-10">

                {/* TOP STATS */}

                <div className="grid md:grid-cols-4 gap-8 mb-12">

                    <div className="bg-white rounded-3xl p-8 shadow-lg">

                        <div className="text-5xl mb-4">
                            🌾
                        </div>

                        <h2 className="text-4xl font-extrabold text-orange-500">
                            120
                        </h2>

                        <p className="text-gray-600 mt-3">
                            Crops Purchased
                        </p>

                    </div>

                    <div className="bg-white rounded-3xl p-8 shadow-lg">

                        <div className="text-5xl mb-4">
                            🚜
                        </div>

                        <h2 className="text-4xl font-extrabold text-orange-500">
                            42
                        </h2>

                        <p className="text-gray-600 mt-3">
                            Farmers Connected
                        </p>

                    </div>

                    <div className="bg-white rounded-3xl p-8 shadow-lg">

                        <div className="text-5xl mb-4">
                            📦
                        </div>

                        <h2 className="text-4xl font-extrabold text-orange-500">
                            18
                        </h2>

                        <p className="text-gray-600 mt-3">
                            Active Orders
                        </p>

                    </div>

                    <div className="bg-white rounded-3xl p-8 shadow-lg">

                        <div className="text-5xl mb-4">
                            💰
                        </div>

                        <h2 className="text-4xl font-extrabold text-orange-500">
                            ₹8.5L
                        </h2>

                        <p className="text-gray-600 mt-3">
                            Total Purchases
                        </p>

                    </div>

                </div>

                {/* MAIN GRID */}

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

                    {/* MARKETPLACE */}

                    <div
                        onClick={() => navigate("/marketplace")}
                        className="bg-white rounded-3xl p-8 shadow-lg hover:scale-105 transition duration-300 cursor-pointer"
                    >

                        <div className="text-6xl mb-5">
                            🛒
                        </div>

                        <h2 className="text-3xl font-bold text-orange-500">
                            Marketplace
                        </h2>

                        <p className="text-gray-600 mt-4 leading-7">
                            Browse and purchase fresh crops from farmers.
                        </p>

                    </div>

                    {/* MY ORDERS */}

                    <div
                        onClick={() => navigate("/buyer-orders")}
                        className="bg-white rounded-3xl p-8 shadow-lg hover:scale-105 transition duration-300 cursor-pointer"
                    >

                        <div className="text-6xl mb-5">
                            📦
                        </div>

                        <h2 className="text-3xl font-bold text-orange-500">
                            My Orders
                        </h2>

                        <p className="text-gray-600 mt-4 leading-7">
                            Track all crop purchases and deliveries.
                        </p>

                    </div>

                    {/* FAVORITE FARMERS */}

                    <div
                        className="bg-white rounded-3xl p-8 shadow-lg hover:scale-105 transition duration-300 cursor-pointer"
                    >

                        <div className="text-6xl mb-5">
                            🚜
                        </div>

                        <h2 className="text-3xl font-bold text-orange-500">
                            Farmers
                        </h2>

                        <p className="text-gray-600 mt-4 leading-7">
                            View connected farmers and suppliers.
                        </p>

                    </div>

                    {/* EXPORTS */}

                    <div
                        className="bg-white rounded-3xl p-8 shadow-lg hover:scale-105 transition duration-300 cursor-pointer"
                    >

                        <div className="text-6xl mb-5">
                            🌍
                        </div>

                        <h2 className="text-3xl font-bold text-orange-500">
                            Export Orders
                        </h2>

                        <p className="text-gray-600 mt-4 leading-7">
                            Manage international crop export requests.
                        </p>

                    </div>

                    {/* PAYMENTS */}

                    <div
                        className="bg-white rounded-3xl p-8 shadow-lg hover:scale-105 transition duration-300 cursor-pointer"
                    >

                        <div className="text-6xl mb-5">
                            💳
                        </div>

                        <h2 className="text-3xl font-bold text-orange-500">
                            Payments
                        </h2>

                        <p className="text-gray-600 mt-4 leading-7">
                            View invoices and completed transactions.
                        </p>

                    </div>

                    {/* AI ANALYTICS */}

                    <div
                        className="bg-white rounded-3xl p-8 shadow-lg hover:scale-105 transition duration-300 cursor-pointer"
                    >

                        <div className="text-6xl mb-5">
                            🤖
                        </div>

                        <h2 className="text-3xl font-bold text-orange-500">
                            AI Analytics
                        </h2>

                        <p className="text-gray-600 mt-4 leading-7">
                            Predict crop demand and market prices.
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default BuyerDashboard;