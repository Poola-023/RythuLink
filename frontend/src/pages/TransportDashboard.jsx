import { useState } from "react";

function TransportDashboard() {
    const [formData, setFormData] = useState({
        cropName: "",
        quantity: "",
        pickupLocation: "",
        deliveryLocation: "",
        deliveryDate: "",
        vehicleType: "",
        notes: ""
    });

    const [requests, setRequests] = useState([]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newRequest = {
            id: Date.now(),
            ...formData,
            status: "Pending"
        };

        setRequests([newRequest, ...requests]);

        alert("Transport Request Created ✅");

        setFormData({
            cropName: "",
            quantity: "",
            pickupLocation: "",
            deliveryLocation: "",
            deliveryDate: "",
            vehicleType: "",
            notes: ""
        });
    };

    return (
        <div className="min-h-screen bg-green-50 p-10">
            <h1 className="text-5xl font-extrabold text-green-700">
                Transport & Logistics 🚛
            </h1>

            <p className="text-gray-600 mt-3 text-lg">
                Arrange crop transportation from farm to buyer location.
            </p>

            <div className="grid lg:grid-cols-2 gap-10 mt-10">
                <form
                    onSubmit={handleSubmit}
                    className="bg-white p-8 rounded-3xl shadow-xl"
                >
                    <h2 className="text-3xl font-bold text-green-700 mb-6">
                        Create Transport Request
                    </h2>

                    <input
                        type="text"
                        name="cropName"
                        placeholder="Crop Name"
                        value={formData.cropName}
                        onChange={handleChange}
                        className="w-full border p-4 rounded-xl mb-4"
                        required
                    />

                    <input
                        type="number"
                        name="quantity"
                        placeholder="Quantity in KG"
                        value={formData.quantity}
                        onChange={handleChange}
                        className="w-full border p-4 rounded-xl mb-4"
                        required
                    />

                    <input
                        type="text"
                        name="pickupLocation"
                        placeholder="Pickup Location"
                        value={formData.pickupLocation}
                        onChange={handleChange}
                        className="w-full border p-4 rounded-xl mb-4"
                        required
                    />

                    <input
                        type="text"
                        name="deliveryLocation"
                        placeholder="Delivery Location"
                        value={formData.deliveryLocation}
                        onChange={handleChange}
                        className="w-full border p-4 rounded-xl mb-4"
                        required
                    />

                    <input
                        type="date"
                        name="deliveryDate"
                        value={formData.deliveryDate}
                        onChange={handleChange}
                        className="w-full border p-4 rounded-xl mb-4"
                        required
                    />

                    <select
                        name="vehicleType"
                        value={formData.vehicleType}
                        onChange={handleChange}
                        className="w-full border p-4 rounded-xl mb-4"
                        required
                    >
                        <option value="">Select Vehicle Type</option>
                        <option value="Auto">Auto</option>
                        <option value="Mini Truck">Mini Truck</option>
                        <option value="Tractor">Tractor</option>
                        <option value="Lorry">Lorry</option>
                        <option value="Container Truck">Container Truck</option>
                    </select>

                    <textarea
                        name="notes"
                        placeholder="Notes / loading help / special instructions"
                        value={formData.notes}
                        onChange={handleChange}
                        className="w-full border p-4 rounded-xl mb-4"
                        rows="4"
                    />

                    <button className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold">
                        Request Transport
                    </button>
                </form>

                <div className="bg-white p-8 rounded-3xl shadow-xl">
                    <h2 className="text-3xl font-bold text-green-700 mb-6">
                        Transport Requests
                    </h2>

                    {requests.length === 0 ? (
                        <div className="bg-green-50 p-8 rounded-2xl text-center">
                            <h3 className="text-2xl font-bold text-gray-700">
                                No requests yet
                            </h3>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            {requests.map((request) => (
                                <div
                                    key={request.id}
                                    className="border rounded-2xl p-5 bg-green-50"
                                >
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-2xl font-bold text-green-700">
                                            {request.cropName}
                                        </h3>

                                        <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full font-bold">
                                            {request.status}
                                        </span>
                                    </div>

                                    <div className="mt-4 space-y-2 text-gray-700">
                                        <p><strong>Quantity:</strong> {request.quantity} KG</p>
                                        <p><strong>Pickup:</strong> {request.pickupLocation}</p>
                                        <p><strong>Delivery:</strong> {request.deliveryLocation}</p>
                                        <p><strong>Date:</strong> {request.deliveryDate}</p>
                                        <p><strong>Vehicle:</strong> {request.vehicleType}</p>
                                        {request.notes && (
                                            <p><strong>Notes:</strong> {request.notes}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TransportDashboard;