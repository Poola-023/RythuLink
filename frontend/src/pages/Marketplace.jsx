import { useEffect, useState } from "react";
import { getAllCrops } from "../services/cropService";
import { placeOrder } from "../services/orderService";

function Marketplace() {
    const [crops, setCrops] = useState([]);
    const [search, setSearch] = useState("");
    const [locationFilter, setLocationFilter] = useState("");
    const [sortBy, setSortBy] = useState("latest");
    const [selectedCrop, setSelectedCrop] = useState(null);
    const [loading, setLoading] = useState(true);

    const [orderData, setOrderData] = useState({
        orderQuantity: "",
        deliveryDate: "",
        deliveryAddress: "",
        notes: ""
    });

    useEffect(() => {
        fetchCrops();
    }, []);

    const fetchCrops = async () => {
        try {
            setLoading(true);
            const response = await getAllCrops();
            setCrops(response.data);
        } catch (error) {
            console.log("MARKETPLACE ERROR:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOrderChange = (e) => {
        setOrderData({
            ...orderData,
            [e.target.name]: e.target.value
        });
    };

    const submitOrder = async (e) => {
        e.preventDefault();

        const buyerId = localStorage.getItem("buyerId");
        const buyerName = localStorage.getItem("buyerName");
        const buyerPhone = localStorage.getItem("buyerPhone");

        if (!buyerId) {
            alert("Please login as buyer first");
            return;
        }

        if (Number(orderData.orderQuantity) > selectedCrop.quantity) {
            alert("Order quantity cannot be more than available stock");
            return;
        }

        try {
            const finalOrder = {
                cropId: selectedCrop.cropId,
                buyerId,
                buyerName: buyerName || "Buyer",
                buyerPhone: buyerPhone || "",
                orderQuantity: Number(orderData.orderQuantity),
                deliveryDate: orderData.deliveryDate,
                deliveryAddress: orderData.deliveryAddress,
                notes: orderData.notes
            };

            await placeOrder(finalOrder);

            alert("Order Placed Successfully ✅");

            setSelectedCrop(null);
            setOrderData({
                orderQuantity: "",
                deliveryDate: "",
                deliveryAddress: "",
                notes: ""
            });

            fetchCrops();
        } catch (error) {
            console.log("ORDER ERROR:", error);

            if (error.response && error.response.data) {
                alert(error.response.data.message || error.response.data);
            } else {
                alert("Order Failed ❌");
            }
        }
    };

    const locations = [
        ...new Set(
            crops
                .map((crop) => crop.location)
                .filter(Boolean)
        )
    ];

    const filteredCrops = crops
        .filter((crop) =>
            crop.cropName?.toLowerCase().includes(search.toLowerCase()) ||
            crop.farmerName?.toLowerCase().includes(search.toLowerCase())
        )
        .filter((crop) =>
            locationFilter ? crop.location === locationFilter : true
        )
        .sort((a, b) => {
            if (sortBy === "priceLow") return a.price - b.price;
            if (sortBy === "priceHigh") return b.price - a.price;
            if (sortBy === "quantityHigh") return b.quantity - a.quantity;
            return 0;
        });

    const totalCrops = crops.length;
    const availableCrops = crops.filter((crop) => crop.quantity > 0).length;
    const totalQuantity = crops.reduce((sum, crop) => sum + Number(crop.quantity || 0), 0);

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-green-50">
                <h1 className="text-3xl font-bold text-green-700">
                    Loading Marketplace...
                </h1>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-green-50">
            <div className="bg-gradient-to-r from-green-700 to-green-500 text-white px-10 py-12">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-5xl font-extrabold">
                        RythuLink Crop Market 🌾
                    </h1>

                    <p className="mt-4 text-xl text-green-100">
                        Buy fresh crops directly from verified farmers.
                    </p>

                    <div className="grid md:grid-cols-3 gap-6 mt-10">
                        <div className="bg-white/15 p-6 rounded-3xl backdrop-blur">
                            <h2 className="text-4xl font-bold">{totalCrops}</h2>
                            <p>Total Listings</p>
                        </div>

                        <div className="bg-white/15 p-6 rounded-3xl backdrop-blur">
                            <h2 className="text-4xl font-bold">{availableCrops}</h2>
                            <p>Available Crops</p>
                        </div>

                        <div className="bg-white/15 p-6 rounded-3xl backdrop-blur">
                            <h2 className="text-4xl font-bold">{totalQuantity} KG</h2>
                            <p>Total Stock</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-10">
                <div className="bg-white rounded-3xl shadow-lg p-6 mb-10 grid md:grid-cols-4 gap-5">
                    <input
                        type="text"
                        placeholder="Search crop or farmer..."
                        className="border p-4 rounded-xl"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <select
                        className="border p-4 rounded-xl"
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                    >
                        <option value="">All Locations</option>
                        {locations.map((location) => (
                            <option key={location} value={location}>
                                {location}
                            </option>
                        ))}
                    </select>

                    <select
                        className="border p-4 rounded-xl"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="latest">Latest</option>
                        <option value="priceLow">Price: Low to High</option>
                        <option value="priceHigh">Price: High to Low</option>
                        <option value="quantityHigh">Quantity: High to Low</option>
                    </select>

                    <button
                        onClick={fetchCrops}
                        className="bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold"
                    >
                        Refresh Market
                    </button>
                </div>

                {filteredCrops.length === 0 ? (
                    <div className="bg-white p-10 rounded-3xl shadow-lg text-center">
                        <h2 className="text-3xl font-bold text-gray-700">
                            No crops found
                        </h2>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredCrops.map((crop) => (
                            <div
                                key={crop.cropId}
                                className="bg-white rounded-3xl overflow-hidden shadow-xl hover:scale-105 transition duration-300"
                            >
                                <div className="relative">
                                    <img
                                        src={
                                            crop.imageUrl ||
                                            "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1200"
                                        }
                                        alt={crop.cropName}
                                        className="h-64 w-full object-cover"
                                    />

                                    <span
                                        className={`absolute top-4 right-4 px-4 py-2 rounded-full font-bold ${
                                            crop.quantity > 0
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                        }`}
                                    >
                                        {crop.quantity > 0 ? "Available" : "Out of Stock"}
                                    </span>
                                </div>

                                <div className="p-6">
                                    <div className="flex justify-between items-center gap-4">
                                        <h2 className="text-3xl font-bold text-green-700">
                                            {crop.cropName}
                                        </h2>

                                        <span className="bg-orange-100 text-orange-600 px-4 py-2 rounded-full font-bold">
                                            ₹{crop.price}/kg
                                        </span>
                                    </div>

                                    <p className="text-gray-600 mt-4 line-clamp-2">
                                        {crop.description}
                                    </p>

                                    <div className="mt-5 space-y-2 text-gray-700">
                                        <p><strong>Crop ID:</strong> {crop.cropId}</p>
                                        <p><strong>Available:</strong> {crop.quantity} KG</p>
                                        <p><strong>Location:</strong> {crop.location}</p>
                                        <p><strong>Farmer:</strong> {crop.farmerName}</p>
                                        <p><strong>Phone:</strong> {crop.farmerPhone || "Not available"}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mt-6">
                                        <button
                                            onClick={() => setSelectedCrop(crop)}
                                            disabled={crop.quantity <= 0}
                                            className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white py-3 rounded-xl font-bold"
                                        >
                                            Order Now
                                        </button>

                                        <a
                                            href={`https://wa.me/91${crop.farmerPhone || ""}`}
                                            target="_blank"
                                            className="text-center bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold"
                                        >
                                            WhatsApp
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {selectedCrop && (
                <div className="fixed inset-0 bg-black/60 flex justify-center items-center p-5 z-50">
                    <form
                        onSubmit={submitOrder}
                        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-xl"
                    >
                        <h2 className="text-3xl font-bold text-orange-500">
                            Order {selectedCrop.cropName}
                        </h2>

                        <p className="text-gray-600 mt-2 mb-6">
                            Available: {selectedCrop.quantity} KG | Price: ₹{selectedCrop.price}/kg
                        </p>

                        <input
                            type="number"
                            name="orderQuantity"
                            placeholder="Quantity in KG"
                            value={orderData.orderQuantity}
                            onChange={handleOrderChange}
                            className="w-full border p-3 mb-4 rounded-xl"
                            min="1"
                            max={selectedCrop.quantity}
                            required
                        />

                        <input
                            type="date"
                            name="deliveryDate"
                            value={orderData.deliveryDate}
                            onChange={handleOrderChange}
                            className="w-full border p-3 mb-4 rounded-xl"
                            required
                        />

                        <textarea
                            name="deliveryAddress"
                            placeholder="Delivery Address"
                            value={orderData.deliveryAddress}
                            onChange={handleOrderChange}
                            className="w-full border p-3 mb-4 rounded-xl"
                            rows="3"
                            required
                        />

                        <textarea
                            name="notes"
                            placeholder="Notes / transport requirement"
                            value={orderData.notes}
                            onChange={handleOrderChange}
                            className="w-full border p-3 mb-4 rounded-xl"
                            rows="3"
                        />

                        <div className="bg-orange-50 p-4 rounded-xl mb-5">
                            <p>
                                <strong>Total Amount:</strong> ₹
                                {Number(orderData.orderQuantity || 0) * selectedCrop.price}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setSelectedCrop(null)}
                                className="bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-xl font-bold"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-bold"
                            >
                                Confirm Order
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

export default Marketplace;