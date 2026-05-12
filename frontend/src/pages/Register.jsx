import { useState } from "react";
import { registerUser } from "../services/authService";
import { useNavigate } from "react-router-dom";

function Register() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "FARMER"
    });

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const response =
                await registerUser(formData);

            alert(response.data);

            navigate("/login");

        } catch (error) {

            console.log(error);

            if (error.response) {

                alert(error.response.data);

            } else {

                alert("Server Not Responding");
            }
        }
    };

    return (

        <div className="h-screen flex justify-center items-center bg-green-100">

            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-xl shadow-lg w-[400px]"
            >

                <h1 className="text-3xl font-bold mb-6 text-center text-green-700">
                    Register
                </h1>

                <input
                    type="text"
                    name="name"
                    placeholder="Enter Name"
                    className="w-full border p-3 mb-4 rounded"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Enter Email"
                    className="w-full border p-3 mb-4 rounded"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Enter Password"
                    className="w-full border p-3 mb-4 rounded"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />

                <select
                    name="role"
                    className="w-full border p-3 mb-4 rounded"
                    value={formData.role}
                    onChange={handleChange}
                >

                    <option value="FARMER">
                        Farmer
                    </option>

                    <option value="BUYER">
                        Buyer
                    </option>

                </select>

                <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700"
                >
                    Register
                </button>

            </form>

        </div>
    );
}

export default Register;