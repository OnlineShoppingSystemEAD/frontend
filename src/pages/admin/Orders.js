import React, { useState, useEffect } from "react";
import Navbar from "../../components/admin/Navbar";
import Footer from "../../components/user/Footer";
import "../../styles/orderlist.css";
import { useNavigate } from "react-router-dom";
import { OrderService } from '../../api/services/OrderService';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    // Fetch orders from OrderService
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const fetchedOrders = await OrderService.getAllOrders();
                console.log(fetchedOrders);
                setOrders(fetchedOrders);
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };

        fetchOrders();
    }, []);

    // CustomDropdown component definition
    const CustomDropdown = ({ options, selected, onChange }) => {
        return (
            <select value={selected} onChange={onChange} className="dropdown-select">
                {options.map((option, index) => (
                    <option value={option} key={index}>
                        {option}
                    </option>
                ))}
            </select>
        );
    };

    // Handle status change for orders
    const handleStatusChange = (orderId, newStatus) => {
        setOrders((prevOrders) =>
            prevOrders.map((order) =>
                order.id === orderId ? { ...order, status: newStatus } : order
            )
        );
    };

    // Handle click on an order to navigate to the order details page
    const handleOrderClick = (order) => {
        navigate(`/order/${order.id}`, { state: { order } });
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
                <div className="order-list-container">
                    <div className="header-row">
                        <div>Order</div>
                        <div>Billing Address</div>
                        <div>Total Price</div>
                        <div className="status-column">
                            Status
                            <div className="sort-by">Sort By</div>
                        </div>
                    </div>
                    {orders.map((order) => (
                        <div
                            onClick={() => handleOrderClick(order)}
                            className="order-row"
                            key={order.id}
                        >
                            <div className="new-badge">{order.id === 1 ? "NEW" : ""}</div>
                            <div className="product-image">
                                <img
                                    src="https://i5.walmartimages.com/seo/Gildan-Adult-Short-Sleeve-Crew-T-Shirt-for-Crafting-Black-Size-L-Soft-Cotton-Classic-Fit-1-Pack-Blank-Tee_85722d56-1379-4323-b738-c05a36fc7276.57f12aa3b01118d3922bca235bd5a185.jpeg"
                                    alt="Product"
                                />
                            </div>
                            <div className="product-info">
                                <p>Order NO {order.id}</p>
                            </div>
                            <div className="billing-info">
                                <p>{order.shippingAddress}</p>
                            </div>
                            <div className="price-info">
                                <p>{order.totalAmount}</p>
                            </div>
                            <div className="status-info">
                                <CustomDropdown
                                    options={["PENDING", "PAID", "ON DELIVERY", "PACKING", "COMPLETED"]}
                                    selected={order.status} // Use order's actual status
                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Orders;
