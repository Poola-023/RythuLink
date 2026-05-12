import { useState } from "react";

import { useNavigate } from "react-router-dom";

import {
    loginUser,
    registerUser
} from "../services/authService";

function Login() {

    const navigate = useNavigate();

    const [isSignup, setIsSignup] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [formData, setFormData] =
        useState({

            name: "",

            email: "",

            password: "",

            phone: "",

            village: ""
        });

    /*
    =========================
    HANDLE INPUT
    =========================
    */

    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]:
                e.target.value
        });
    };

    /*
    =========================
    HANDLE SUBMIT
    =========================
    */

    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);

        try {

            /*
            =========================
            FARMER SIGNUP
            =========================
            */

            if (isSignup) {

                await registerUser(formData);

                alert(
                    "Farmer Registration Successful ✅"
                );

                setIsSignup(false);

                setLoading(false);

                return;
            }

            /*
            =========================
            FARMER LOGIN
            =========================
            */

            const response =
                await loginUser({

                    email:
                        formData.email,

                    password:
                        formData.password
                });

            console.log(
                "LOGIN RESPONSE:",
                response.data
            );

            /*
            =========================
            STORE LOGIN DATA
            =========================
            */

            localStorage.setItem(
                "token",
                response.data.token
            );

            localStorage.setItem(
                "farmerId",
                response.data.farmerId
            );

            localStorage.setItem(
                "farmerName",
                response.data.name
            );

            localStorage.setItem(
                "farmerEmail",
                response.data.email
            );

            /*
            =========================
            SUCCESS
            =========================
            */

            alert(
                "Farmer Login Successful ✅"
            );

            navigate("/dashboard");

        } catch (error) {

            console.log("LOGIN ERROR:", error);

            if (error.response) {
                console.log("Backend message:", error.response.data);
                alert(error.response.data);
            } else {
                alert("Server not responding");
            }

        } finally {
        setLoading(false);
    }
    
};

return (

    <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-green-200 flex justify-center items-center px-4 py-10">

        <div className="grid lg:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden max-w-6xl w-full">

            {/* LEFT SIDE */}

            <div className="bg-green-700 text-white p-14 flex flex-col justify-center">

                <div>

                    <h1 className="text-6xl font-extrabold leading-tight">

                        RythuLink AI 🌱

                    </h1>

                    <p className="mt-8 text-xl leading-9 text-green-100">

                        India's smart agriculture platform helping farmers
                        sell crops directly to buyers using AI technology.

                    </p>

                </div>

                {/* FEATURES */}

                <div className="mt-14 space-y-7">

                    <div className="flex items-center gap-5">

                        <div className="bg-white text-green-700 h-14 w-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg">

                            🌾

                        </div>

                        <div>

                            <h3 className="font-bold text-xl">
                                Smart Marketplace
                            </h3>

                            <p className="text-green-100">
                                Direct crop selling system
                            </p>

                        </div>

                    </div>

                    <div className="flex items-center gap-5">

                        <div className="bg-white text-green-700 h-14 w-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg">

                            🤖

                        </div>

                        <div>

                            <h3 className="font-bold text-xl">
                                AI Crop Analysis
                            </h3>

                            <p className="text-green-100">
                                Smart crop recommendations
                            </p>

                        </div>

                    </div>

                    <div className="flex items-center gap-5">

                        <div className="bg-white text-green-700 h-14 w-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg">

                            🚜

                        </div>

                        <div>

                            <h3 className="font-bold text-xl">
                                Farmer Network
                            </h3>

                            <p className="text-green-100">
                                Connect with buyers & exporters
                            </p>

                        </div>

                    </div>

                </div>

            </div>

            {/* RIGHT SIDE */}

            <div className="p-10 lg:p-14 flex flex-col justify-center">

                {/* HEADER */}

                <div className="mb-10">

                    <h2 className="text-4xl font-extrabold text-green-700">

                        {
                            isSignup
                                ? "Farmer Signup"
                                : "Farmer Login"
                        }

                    </h2>

                    <p className="text-gray-500 mt-3 text-lg">

                        {
                            isSignup
                                ? "Create your farmer account"
                                : "Welcome back farmer"
                        }

                    </p>

                </div>

                {/* FORM */}

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    {
                        isSignup && (

                            <input
                                type="text"
                                name="name"
                                placeholder="Farmer Name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-2xl p-4 text-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                required
                            />
                        )
                    }

                    {
                        isSignup && (

                            <input
                                type="text"
                                name="phone"
                                placeholder="Phone Number"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-2xl p-4 text-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                required
                            />
                        )
                    }

                    {
                        isSignup && (

                            <input
                                type="text"
                                name="village"
                                placeholder="Village"
                                value={formData.village}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-2xl p-4 text-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                required
                            />
                        )
                    }

                    <input
                        type="email"
                        name="email"
                        placeholder="Enter Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-2xl p-4 text-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Enter Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-2xl p-4 text-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                    />

                    {/* BUTTON */}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl text-lg font-bold shadow-lg transition duration-300"
                    >

                        {
                            loading
                                ? "Please Wait..."
                                : (
                                    isSignup
                                        ? "Create Farmer Account"
                                        : "Login To Dashboard"
                                )
                        }

                    </button>

                </form>

                {/* TOGGLE */}

                <div className="mt-8 text-center">

                    <p className="text-gray-600 text-lg">

                        {
                            isSignup
                                ? "Already have an account?"
                                : "New farmer here?"
                        }

                        <button
                            onClick={() =>
                                setIsSignup(!isSignup)
                            }
                            className="ml-2 text-green-700 font-bold hover:underline"
                        >

                            {
                                isSignup
                                    ? "Login"
                                    : "Create Account"
                            }

                        </button>

                    </p>

                </div>

            </div>

        </div>

    </div>
);
}

export default Login;