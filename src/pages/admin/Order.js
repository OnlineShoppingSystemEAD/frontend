import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../styles/orderDetails.css';
import Navbar from "../../components/admin/Navbar";
import Footer from "../../components/user/Footer";
import {OrderItemsService, OrderService} from '../../api/services/OrderService';
import userService from "../../api/services/UserService";

const Order = () => {
    const { id } = useParams(); // Retrieve orderId from the URL
    const navigate = useNavigate();

    const [order, setOrder] = useState(null); // State to store the order details
    const [userData, setUserData] = useState(null); // State to store the user details
    const [isLoading, setIsLoading] = useState(true); // State to manage loading state
    const [isEditMode, setEditMode] = useState(false);
    const [updatedOrder, setUpdatedOrder] = useState(null);

    // Fetch order and user details
    useEffect(() => {
        const fetchOrderAndUserDetails = async () => {
            try {
                setIsLoading(true);
                // Fetch order details
                const fetchedOrder = await OrderItemsService.getProductsByCategory(id);
                setOrder(fetchedOrder);
                setUpdatedOrder(fetchedOrder); // Initialize updated order state

                // Fetch user details
                const response = await userService.getUserProfileById(fetchedOrder.userId,fetchedOrder.userId, "USER");
                setUserData(response.data);
            } catch (error) {
                console.error("Error fetching order or user details:", error);
                navigate('/'); // Redirect to the home page in case of an error
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrderAndUserDetails();
    }, [id, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedOrder({ ...updatedOrder, [name]: value });
    };

    const handleSaveClick = async () => {
        try {
            // Send updated order data to the server
            await OrderService.updateOrderStatus(id, updatedOrder);
            setOrder(updatedOrder); // Update local order state
            setEditMode(false);
        } catch (error) {
            console.error("Error updating order:", error);
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
                    <div className="order-header">
                        <div className="order-image">
                            <img
                                src="https://objectstorage.ap-mumbai-1.oraclecloud.com/n/softlogicbicloud/b/cdn/o/category-images/60ab26835e322.png"
                                alt="Order"
                            />
                        </div>
                        <div className="order-summary">
                            <h2>Order Number - {order.id}</h2>
                            <p>
                                Total Price: {isEditMode ? (
                                <input
                                    type="number"
                                    name="totalAmount"
                                    value={updatedOrder.totalAmount}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                `$${order.totalAmount}`
                            )}
                            </p>
                            <p>
                                Status: {isEditMode ? (
                                <select
                                    name="status"
                                    value={updatedOrder.status || "PENDING"}
                                    onChange={handleInputChange}
                                    className="status-dropdown"
                                >
                                    <option value="PENDING">PENDING</option>
                                    <option value="PAID">PAID</option>
                                    <option value="ON DELIVERY">ON DELIVERY</option>
                                    <option value="COMPLETED">COMPLETED</option>
                                </select>
                            ) : (
                                order.status || "N/A"
                            )}
                            </p>
                        </div>
                        <div className="order-actions">
                            {isEditMode ? (
                                <button className="update-button" onClick={handleSaveClick}>Save</button>
                            ) : (
                                <button className="update-button" onClick={() => setEditMode(true)}>Edit</button>
                            )}
                        </div>
                    </div>

                    <div className="order-details">
                        <div className="detail-row">
                            <strong>Shipping Address:</strong>
                            {isEditMode ? (
                                <input
                                    type="text"
                                    name="shippingAddress"
                                    value={updatedOrder.shippingAddress}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <span>{order.shippingAddress}</span>
                            )}
                        </div>
                        <div className="detail-row">
                            <strong>User Name:</strong>
                            <span>{userData?.name || "N/A"}</span>
                        </div>
                        <div className="detail-row">
                            <strong>User Email:</strong>
                            <span>{userData?.email || "N/A"}</span>
                        </div>
                    </div>

                    <div className="footer-actions">
                        <button className="back-button" onClick={() => navigate(-1)}>Back</button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Order;
