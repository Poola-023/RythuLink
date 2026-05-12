import { useEffect, useState } from "react";
import {
    getFarmerOrders,
    updateOrderStatus
} from "../services/orderService";

function FarmerOrders() {

    const farmerId = localStorage.getItem("farmerId");

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await getFarmerOrders(farmerId);
            setOrders(response.data);
        } catch (error) {
            console.log("FARMER ORDERS ERROR:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId, status) => {
        try {
            await updateOrderStatus(orderId, status);

            alert(`Order ${status}`);

            fetchOrders();
        } catch (error) {
            console.log("STATUS UPDATE ERROR:", error);
            alert("Status update failed");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-green-50">
                <h1 className="text-3xl font-bold text-green-700">
                    Loading Orders...
                </h1>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-green-50 p-10">

            <div className="mb-10">
                <h1 className="text-5xl font-extrabold text-green-700">
                    Farmer Orders 📦
                </h1>

                <p className="text-gray-600 mt-3 text-lg">
                    View and manage buyer crop orders
                </p>
            </div>

            {orders.length === 0 ? (
                <div className="bg-white p-10 rounded-3xl shadow-lg text-center">
                    <h2 className="text-3xl font-bold text-gray-700">
                        No Orders Received
                    </h2>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {orders.map((order) => (
                        <div
                            key={order.orderId}
                            className="bg-white rounded-3xl shadow-xl p-6"
                        >
                            <div className="flex justify-between items-center gap-4">
                                <h2 className="text-3xl font-bold text-green-700">
                                    {order.cropName}
                                </h2>

                                <span
                                    className={`px-4 py-2 rounded-full font-bold ${
                                        order.status === "ACCEPTED"
                                            ? "bg-green-100 text-green-700"
                                            : order.status === "REJECTED"
                                            ? "bg-red-100 text-red-700"
                                            : order.status === "DELIVERED"
                                            ? "bg-blue-100 text-blue-700"
                                            : "bg-yellow-100 text-yellow-700"
                                    }`}
                                >
                                    {order.status}
                                </span>
                            </div>

                            <div className="mt-5 space-y-2 text-gray-700">
                                <p>
                                    <strong>Order ID:</strong> {order.orderId}
                                </p>

                                <p>
                                    <strong>Buyer:</strong> {order.buyerName}
                                </p>

                                <p>
                                    <strong>Buyer Phone:</strong> {order.buyerPhone || "Not available"}
                                </p>

                                <p>
                                    <strong>Quantity:</strong> {order.orderQuantity} KG
                                </p>

                                <p>
                                    <strong>Price:</strong> ₹{order.pricePerKg}/kg
                                </p>

                                <p>
                                    <strong>Total Amount:</strong> ₹{order.totalAmount}
                                </p>

                                <p>
                                    <strong>Delivery Date:</strong> {order.deliveryDate}
                                </p>

                                <p>
                                    <strong>Delivery Address:</strong> {order.deliveryAddress}
                                </p>

                                {order.notes && (
                                    <p>
                                        <strong>Notes:</strong> {order.notes}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-6">
                                <button
                                    onClick={() =>
                                        handleStatusUpdate(order.orderId, "ACCEPTED")
                                    }
                                    disabled={order.status !== "PENDING"}
                                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 rounded-xl font-bold"
                                >
                                    Accept
                                </button>

                                <button
                                    onClick={() =>
                                        handleStatusUpdate(order.orderId, "REJECTED")
                                    }
                                    disabled={order.status !== "PENDING"}
                                    className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white py-3 rounded-xl font-bold"
                                >
                                    Reject
                                </button>

                                <button
                                    onClick={() =>
                                        handleStatusUpdate(order.orderId, "PACKED")
                                    }
                                    disabled={order.status !== "ACCEPTED"}
                                    className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 text-white py-3 rounded-xl font-bold"
                                >
                                    Packed
                                </button>

                                <button
                                    onClick={() =>
                                        handleStatusUpdate(order.orderId, "DELIVERED")
                                    }
                                    disabled={order.status !== "PACKED"}
                                    className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white py-3 rounded-xl font-bold"
                                >
                                    Delivered
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default FarmerOrders;