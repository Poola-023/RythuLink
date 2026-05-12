import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    registerBuyer,
    loginBuyer
} from "../services/buyerService";

function BuyerLogin() {

    const navigate = useNavigate();

    const [isSignup, setIsSignup] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        buyerName: "",
        companyName: "",
        email: "",
        password: "",
        phone: "",
        location: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isSignup) {
                await registerBuyer(formData);

                alert("Buyer Registration Successful ✅");
                setIsSignup(false);
                return;
            }

            const response = await loginBuyer({
                email: formData.email,
                password: formData.password
            });

            console.log("BUYER LOGIN RESPONSE:", response.data);

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("buyerId", response.data.buyerId);
            localStorage.setItem("buyerName", response.data.buyerName);
            localStorage.setItem("buyerEmail", response.data.email);
            localStorage.setItem("buyerPhone", formData.phone || "");

            alert("Buyer Login Successful ✅");

            navigate("/buyer-dashboard");

        } catch (error) {
            console.log(error);

            if (error.response && error.response.data) {
                alert(error.response.data);
            } else {
                alert(
                    isSignup
                        ? "Buyer Registration Failed ❌"
                        : "Invalid Buyer Credentials ❌"
                );
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-100 via-white to-yellow-100 flex justify-center items-center px-4 py-10">
            <div className="grid lg:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden max-w-6xl w-full">

                <div className="bg-orange-500 text-white p-14 flex flex-col justify-center">
                    <h1 className="text-6xl font-extrabold leading-tight">
                        Buyer Portal 🛒
                    </h1>

                    <p className="mt-8 text-xl leading-9 text-orange-100">
                        Buy fresh crops directly from farmers, manage orders,
                        and connect with trusted suppliers.
                    </p>

                    <div className="mt-12 space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-white text-orange-500 h-12 w-12 rounded-xl flex items-center justify-center text-2xl">
                                🌾
                            </div>
                            <p className="text-lg">Direct crop sourcing</p>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="bg-white text-orange-500 h-12 w-12 rounded-xl flex items-center justify-center text-2xl">
                                📦
                            </div>
                            <p className="text-lg">Bulk order management</p>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="bg-white text-orange-500 h-12 w-12 rounded-xl flex items-center justify-center text-2xl">
                                🚛
                            </div>
                            <p className="text-lg">Delivery planning</p>
                        </div>
                    </div>
                </div>

                <div className="p-10 lg:p-14 flex flex-col justify-center">
                    <div className="mb-10">
                        <h2 className="text-4xl font-extrabold text-orange-500">
                            {isSignup ? "Buyer Signup" : "Buyer Login"}
                        </h2>

                        <p className="text-gray-500 mt-3 text-lg">
                            {isSignup ? "Create your buyer account" : "Welcome back buyer"}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {isSignup && (
                            <input
                                type="text"
                                name="buyerName"
                                placeholder="Buyer Name"
                                value={formData.buyerName}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-xl p-4 text-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                required
                            />
                        )}

                        {isSignup && (
                            <input
                                type="text"
                                name="companyName"
                                placeholder="Company / Shop Name"
                                value={formData.companyName}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-xl p-4 text-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                required
                            />
                        )}

                        {isSignup && (
                            <input
                                type="text"
                                name="phone"
                                placeholder="Phone Number"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-xl p-4 text-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                required
                            />
                        )}

                        {isSignup && (
                            <input
                                type="text"
                                name="location"
                                placeholder="Location"
                                value={formData.location}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-xl p-4 text-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                required
                            />
                        )}

                        <input
                            type="email"
                            name="email"
                            placeholder="Enter Email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-xl p-4 text-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            required
                        />

                        <input
                            type="password"
                            name="password"
                            placeholder="Enter Password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-xl p-4 text-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            required
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl text-lg font-bold shadow-lg transition"
                        >
                            {loading
                                ? "Please Wait..."
                                : isSignup
                                    ? "Create Buyer Account"
                                    : "Login To Buyer Dashboard"}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-gray-600">
                            {isSignup ? "Already have an account?" : "New buyer here?"}

                            <button
                                onClick={() => setIsSignup(!isSignup)}
                                className="ml-2 text-orange-500 font-bold hover:underline"
                            >
                                {isSignup ? "Login" : "Create Account"}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BuyerLogin;