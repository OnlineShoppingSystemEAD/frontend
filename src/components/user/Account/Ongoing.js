import React, { useEffect, useState } from 'react';
import PaymentService from "../../../api/services/PaymentService";
import UserService from "../../../api/services/UserService";
import { OrderService } from "../../../api/services/OrderService";

const Ongoing = () => {
  const [ongoingOrders, setOngoingOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOngoingOrders = async () => {
      try {
        setLoading(true);
        const userId = UserService.getUserId(); // Retrieve userId dynamically
        const orderIds = await PaymentService.getPendingAndPaidDeliveryOrderIdsByUserId(userId); // Fetch order IDs
        const orders = await Promise.all(
            orderIds.map(async (orderId) => {
              console.log(orderId);
              const orderDetails = await OrderService.getOrderByOrderId(orderId);
              return orderDetails; // Fetch order details for each orderId
            })
        );
        // console.log(orders);
        setOngoingOrders(orders); // Set all fetched orders
      } catch (error) {
        console.error("Error fetching ongoing orders:", error);
        setError("Failed to load ongoing orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOngoingOrders();
  }, []);

  return (
      <div>
        <h2 className="text-xl font-bold mb-4">Ongoing Orders</h2>

        {loading && <p>Loading ongoing orders...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && ongoingOrders.length === 0 && (
            <p>No ongoing orders found.</p>
        )}

        {!loading && !error && ongoingOrders.length > 0 && (
            <>
              {/* Table Headings */}
              <div className="grid grid-cols-5 text-sm font-semibold text-gray-600 mb-2">
                <div>Order ID</div>
                <div>Payment ID</div>
                <div>Billing Address</div>
                <div>Total Price</div>
                <div>Status</div>
              </div>

              {/* Divider */}
              <hr className="border-gray-300 mb-4" />

              {/* Orders */}
              {ongoingOrders.map((order) => (
                  <div
                      key={order.id}
                      className="grid grid-cols-5 items-center bg-gray-100 p-4 mb-4 rounded-lg shadow-md"
                  >
                    {/* Order ID */}
                    <div>{order.id}</div>

                    {/* Product Description */}
                    <div>
                      <h3 className="font-semibold">{order.paymentId || "N/A"}</h3>
                      <p className="text-sm text-gray-500">.................................</p>
                    </div>

                    {/* Billing Address */}
                    <div>
                      <p>{order.shippingAddress || "N/A"}</p>
                      <p className="text-sm text-gray-500">.................................</p>
                    </div>

                    {/* Total Price */}
                    <div>{order.totalAmount || "N/A"}</div>

                    {/* Status */}
                    <div>{order.status || "N/A"}</div>
                  </div>
              ))}
            </>
        )}
      </div>
  );
};

export default Ongoing;
