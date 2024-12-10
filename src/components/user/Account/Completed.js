import React, { useState, useEffect } from 'react';
import PaymentService from "../../../api/services/PaymentService";
import UserService from "../../../api/services/UserService";
import { OrderService } from "../../../api/services/OrderService";

const Completed = () => {
  const [completedOrders, setCompletedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompletedOrders = async () => {
      try {
        setLoading(true);
        const userId = UserService.getUserId(); // Retrieve user ID dynamically

        // Fetch all orders for the user
        const allOrderIds = await PaymentService.getAllOrderIdsByUserId(userId);
        console.log(allOrderIds);

        // Fetch ongoing orders
        const ongoingOrderIds = await PaymentService.getPendingAndPaidDeliveryOrderIdsByUserId(userId);

        // Filter out ongoing orders
        const completedOrderIds = allOrderIds.filter(
            (orderId) => !ongoingOrderIds.includes(orderId)
        );

        // Fetch details for completed orders
        const completedOrdersDetails = await Promise.all(
            completedOrderIds.map(async (orderId) => {
              const orderDetails = await OrderService.getOrderByOrderId(orderId);
              return orderDetails;
            })
        );

        setCompletedOrders(completedOrdersDetails);
      } catch (err) {
        console.error("Failed to fetch completed orders:", err);
        setError("Could not fetch completed orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedOrders();
  }, []);

  if (loading) return <div>Loading completed orders...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
      <div>
        <h2 className="text-xl font-bold mb-4">Completed Orders</h2>

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

        {/* Completed Orders */}
        {completedOrders.length === 0 ? (
            <div>No completed orders available.</div>
        ) : (
            completedOrders.map((order) => (
                <div
                    key={order.id}
                    className="grid grid-cols-5 items-center bg-gray-100 p-4 mb-4 rounded-lg shadow-md"
                >
                  {/* Order ID */}
                  <div>{order.id}</div>

                  {/* Payment ID */}
                  <div>
                    <h3 className="font-semibold">{order.paymentId || "N/A"}</h3>
                    <p className="text-sm text-gray-500">.................................</p>
                  </div>

                  {/* Billing Address */}
                  <div>
                    <p>{order.billingAddress || "N/A"}</p>
                    <p className="text-sm text-gray-500">.................................</p>
                  </div>

                  {/* Total Price */}
                  <div>{order.totalPrice || "N/A"}</div>

                  {/* Status */}
                  <div>{order.status || "N/A"}</div>
                </div>
            ))
        )}
      </div>
  );
};

export default Completed;
