import { useNavigate } from "react-router-dom";

function AdminDashboard() {

    const navigate = useNavigate();

    return (

        <div className="min-h-screen flex">

            {/* SIDEBAR */}

            <div className="w-[250px] bg-green-800 text-white p-6">

                <h1 className="text-3xl font-bold mb-10">
                    Admin Panel
                </h1>

                <div className="space-y-5">

                    <button
                        onClick={() => navigate("/admin/users")}
                        className="block w-full text-left hover:text-yellow-300"
                    >
                        Manage Users
                    </button>

                    <button
                        onClick={() => navigate("/admin/crops")}
                        className="block w-full text-left hover:text-yellow-300"
                    >
                        Manage Crops
                    </button>

                    <button
                        onClick={() => navigate("/admin/reports")}
                        className="block w-full text-left hover:text-yellow-300"
                    >
                        Reports
                    </button>

                    <button
                        onClick={() => navigate("/admin/fraud")}
                        className="block w-full text-left hover:text-yellow-300"
                    >
                        Fraud Detection
                    </button>

                </div>

            </div>

            {/* CONTENT */}

            <div className="flex-1 bg-green-100 p-10">

                <h1 className="text-4xl font-bold text-green-700">
                    Admin Dashboard 📊
                </h1>

                {/* ANALYTICS CARDS */}

                <div className="grid md:grid-cols-4 gap-6 mt-10">

                    <div className="bg-white p-6 rounded-xl shadow-lg">

                        <h2 className="text-xl font-bold">
                            Total Users
                        </h2>

                        <p className="text-3xl mt-4 text-green-700">
                            120
                        </p>

                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-lg">

                        <h2 className="text-xl font-bold">
                            Total Crops
                        </h2>

                        <p className="text-3xl mt-4 text-green-700">
                            85
                        </p>

                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-lg">

                        <h2 className="text-xl font-bold">
                            Orders
                        </h2>

                        <p className="text-3xl mt-4 text-green-700">
                            42
                        </p>

                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-lg">

                        <h2 className="text-xl font-bold">
                            Fraud Reports
                        </h2>

                        <p className="text-3xl mt-4 text-red-500">
                            3
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default AdminDashboard;