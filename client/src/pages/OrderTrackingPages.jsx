import React, { useEffect, useState } from "react";
import OrderTracking from "../components/OrderTracking"; // adjust path if needed
import Axios from "../utils/axios";

const OrderTrackingPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await Axios.get("/api/order/user");
        if (data.success) {
          setOrders(Array.isArray(data.data) ? data.data : []);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Track Your Orders</h1>

      {loading ? (
        <p>Loading...</p>
      ) : !Array.isArray(orders) || orders.length === 0 ? (
        <p className="text-gray-500">You have no orders to track.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            className="mb-10 p-4 border border-gray-200 rounded-lg shadow-sm"
          >
            <div className="mb-4">
              <h2 className="text-md font-medium text-gray-700">
                Order ID: <span className="font-mono">{order._id}</span>
              </h2>
              <p className="text-sm text-gray-500">
                Date: {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Just delivery status, no product details */}
            <OrderTracking deliveryStatus={order.delivery_status} />
          </div>
        ))
      )}
    </div>
  );
};

export default OrderTrackingPage;
