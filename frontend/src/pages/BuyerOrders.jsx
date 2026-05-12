import { useEffect, useState } from "react";
import { getBuyerOrders } from "../services/orderService";

function BuyerOrders() {

    const buyerId = localStorage.getItem("buyerId");

    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await getBuyerOrders(buyerId);
            setOrders(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="min-h-screen bg-orange-50 p-10">
            <h1 className="text-5xl font-extrabold text-orange-500 mb-10">
                My Orders 📦
            </h1>

            {orders.length === 0 ? (
                <div className="bg-white p-10 rounded-3xl shadow-lg text-center">
                    <h2 className="text-3xl font-bold text-gray-700">
                        No Orders Yet
                    </h2>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {orders.map((order) => (
                        <div
                            key={order.orderId}
                            className="bg-white rounded-3xl shadow-xl p-6"
                        >
                            <h2 className="text-3xl font-bold text-orange-500">
                                {order.cropName}
                            </h2>

                            <div className="mt-5 space-y-2">
                                <p><strong>Order ID:</strong> {order.orderId}</p>
                                <p><strong>Quantity:</strong> {order.orderQuantity} KG</p>
                                <p><strong>Total:</strong> ₹{order.totalAmount}</p>
                                <p><strong>Delivery Date:</strong> {order.deliveryDate}</p>
                                <p><strong>Farmer:</strong> {order.farmerName}</p>
                                <p><strong>Status:</strong> {order.status}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default BuyerOrders;