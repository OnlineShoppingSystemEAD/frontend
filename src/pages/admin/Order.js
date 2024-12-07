import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../styles/orderDetails.css';
import Navbar from "../../components/admin/Navbar";
import Footer from "../../components/user/Footer";
import { OrderItemsService, OrderService } from '../../api/services/OrderService';
import UserService from "../../api/services/UserService";

const Order = () => {
    const { orderId } = useParams(); // Retrieve orderId from the URL
    const navigate = useNavigate();

    const [order, setOrder] = useState(null); // State to store the order details
    const [products, setProducts] = useState([]); // State to store products
    const [isLoading, setIsLoading] = useState(true); // State to manage loading state
    const [isEditMode, setIsEditMode] = useState(false); // State for edit mode
    const [updatedStatus, setUpdatedStatus] = useState(''); // State for editable status

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const fetchedOrder = await OrderItemsService.getProductsByOrder(orderId);

                if (fetchedOrder && fetchedOrder.length > 0) {
                    const orderDetails = fetchedOrder[0].order;
                    const userId = orderDetails.userId;

                    // Fetch user profile
                    const userResponse = await UserService.getUserProfileById(userId, userId, "USER");
                    const userData = userResponse.data;

                    // Combine user and order data
                    const combinedOrderDetails = {
                        ...orderDetails,
                        customerName: `${userData.firstName} ${userData.lastName}`,
                        email: userData.email,
                        billingAddress: `${userData.houseNumber}, ${userData.addressLine1}, ${userData.addressLine2}`,
                    };

                    setOrder(combinedOrderDetails);
                    setProducts(
                        fetchedOrder.map(item => ({
                            itemName: item.itemName || "N/A",
                            quantity: item.quantity || 0,
                            itemPrice: item.itemPrice || 0,
                        }))
                    );
                    setUpdatedStatus(orderDetails.status || "N/A");
                }
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching order details:", error);
                navigate('/'); // Redirect to the home page in case of an error
            }
        };

        fetchOrderDetails();
    }, [orderId, navigate]);

    const handleStatusChange = (e) => {
        setUpdatedStatus(e.target.value);
    };

    const handleSaveClick = async () => {
        try {
            await OrderService.updateOrderStatus(orderId, { status: updatedStatus });
            setOrder(prev => ({ ...prev, status: updatedStatus })); // Update local state
            setIsEditMode(false); // Exit edit mode
        } catch (error) {
            console.error("Error updating order status:", error);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
                <div className="order-details-container">
                    <h2>Order Number - {orderId}</h2>
                    <div className="order-details">
                        <div className="detail-row">
                            <strong>Customer Name:</strong> {order.customerName || "N/A"}
                        </div>
                        <div className="detail-row">
                            <strong>Email Address:</strong> {order.email || "N/A"}
                        </div>
                        <div className="detail-row">
                            <strong>Billing Address:</strong> {order.billingAddress || "N/A"}
                        </div>
                        <div className="detail-row">
                            <strong>Total Price:</strong> {order.totalAmount || "N/A"}
                        </div>
                        <div className="detail-row">
                            <strong>Status:</strong> {isEditMode ? (
                            order.status === "PAID" ? (
                                <select
                                    value={updatedStatus}
                                    onChange={handleStatusChange}
                                >
                                    <option value="PAID">PAID</option>
                                    <option value="DELIVERY">DELIVERY</option>
                                    <option value="COMPLETED">COMPLETED</option>
                                </select>
                            ) : (
                                <input
                                    type="text"
                                    value={updatedStatus}
                                    onChange={handleStatusChange}
                                />
                            )
                        ) : (
                            order.status || "N/A"
                        )}
                        </div>
                    </div>

                    <div className="order-products">
                        <h3>Products</h3>
                        {products.map((product, index) => (
                            <div key={index} className="product-item">
                                <p>
                                    <strong>Item Name:</strong> {product.itemName}
                                </p>
                                <p>
                                    <strong>Quantity:</strong> {product.quantity}
                                </p>
                                <p>
                                    <strong>Price:</strong> {product.itemPrice}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="order-actions">
                        {isEditMode ? (
                            <button className="save-button" onClick={handleSaveClick}>
                                Save Status
                            </button>
                        ) : (
                            <button className="edit-button" onClick={() => setIsEditMode(true)}>
                                Edit Status
                            </button>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Order;
