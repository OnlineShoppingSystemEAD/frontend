// OrderDetails.js
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../styles/orderDetails.css';
import Navbar from "../../components/admin/Navbar";
import Footer from "../../components/user/Footer";

const Order = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const order = location.state?.order;

    const [isEditMode, setEditMode] = useState(false);
    const [updatedOrder, setUpdatedOrder] = useState({
        ...order,
        deliveryPerson: Array.isArray(order?.deliveryPerson) ? order.deliveryPerson : [], // Ensure deliveryPerson is an array
    });
    const [showAssignSlider, setShowAssignSlider] = useState(false);

    const deliveryPeople = ["Name 1", "Name 2", "Name 3", "Name 4"];

    if (!order) {
        navigate('/');
        return null;
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedOrder({ ...updatedOrder, [name]: value });
    };

    const handleAssignClick = () => {
        setShowAssignSlider(!showAssignSlider);
    };

    const handleAssignDeliveryPerson = (person) => {
        // Add the person to the deliveryPerson list if not already assigned
        if (!updatedOrder.deliveryPerson.includes(person)) {
            setUpdatedOrder({
                ...updatedOrder,
                deliveryPerson: [...updatedOrder.deliveryPerson, person],
            });
        }
        setShowAssignSlider(false); // Close the slider after selecting a person
    };

    const handleUpdateClick = () => {
        setEditMode(true);
    };

    const handleSaveClick = () => {
        // Here you would typically send the updated order data to the server
        console.log("Updated order data:", updatedOrder);
        setEditMode(false);
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
                <div className="order-details-container">
                    <div className="order-header">
                        <div className="order-image">
                            <img
                                src="https://objectstorage.ap-mumbai-1.oraclecloud.com/n/softlogicbicloud/b/cdn/o/category-images/60ab26835e322.png"
                                alt="Product"
                            />
                        </div>
                        <div className="order-summary">
                            <h2>Order Number - {updatedOrder.orderNumber}</h2>
                            <p>Product Name: {isEditMode ? (
                                <input
                                    type="text"
                                    name="productName"
                                    value={updatedOrder.productName}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                updatedOrder.productName
                            )}</p>
                            <p>Quantity: {isEditMode ? (
                                <input
                                    type="number"
                                    name="quantity"
                                    value={updatedOrder.quantity}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                updatedOrder.quantity
                            )}</p>
                        </div>
                        <div className="order-actions">
                            {isEditMode ? (
                                <button className="update-button" onClick={handleSaveClick}>Save</button>
                            ) : (
                                <button className="update-button" onClick={handleUpdateClick}>Update</button>
                            )}
                            <button className="assign-button" onClick={handleAssignClick}>
                                Assign Delivery Person
                            </button>
                        </div>
                    </div>

                    <div className="order-details">
                        <div className="detail-row">
                            <strong>Customer Name:</strong>
                            {isEditMode ? (
                                <input
                                    type="text"
                                    name="customerName"
                                    value={updatedOrder.customerName}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <span>{updatedOrder.customerName}</span>
                            )}
                        </div>
                        <div className="detail-row">
                            <strong>Email Address:</strong>
                            {isEditMode ? (
                                <input
                                    type="email"
                                    name="email"
                                    value={updatedOrder.email}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <span>{updatedOrder.email}</span>
                            )}
                        </div>
                        <div className="detail-row">
                            <strong>Billing Address:</strong>
                            {isEditMode ? (
                                <input
                                    type="text"
                                    name="billingAddress"
                                    value={updatedOrder.billingAddress}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <span>{updatedOrder.billingAddress}</span>
                            )}
                        </div>
                        <div className="detail-row">
                            <strong>Total Price:</strong>
                            {isEditMode ? (
                                <input
                                    type="text"
                                    name="price"
                                    value={updatedOrder.price}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <span>{updatedOrder.price}</span>
                            )}
                        </div>
                        <div className="detail-row">
                            <strong>Delivery Person:</strong>
                            {isEditMode ? (
                                <input
                                    type="text"
                                    name="deliveryPerson"
                                    value={updatedOrder.deliveryPerson || ""}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <span>{updatedOrder.deliveryPerson || "None"}</span>
                            )}
                        </div>

                        {/* Slider for Assigning Delivery Person */}
                        {showAssignSlider && (
                            <div className="assign-slider">
                                {deliveryPeople.map((person, index) => (
                                    <div
                                        key={index}
                                        className="slider-item"
                                        onClick={() => handleAssignDeliveryPerson(person)}
                                    >
                                        {person}
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="detail-row">
                            <strong>Status:</strong>
                            {isEditMode ? (
                                <select
                                    name="status"
                                    value={updatedOrder.status}
                                    onChange={handleInputChange}
                                    className="status-dropdown"
                                >
                                    <option value="Paid">Paid</option>
                                    <option value="On Delivery">On Delivery</option>
                                    <option value="Packing">Packing</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            ) : (
                                <span>{updatedOrder.status}</span>
                            )}
                        </div>
                    </div>

                    <div className="footer-actions">
                    <button className="back-button" onClick={() => navigate(-1)}>Back</button>
                </div>
        </div>
</main>
    <Footer/>
</div>
)
    ;
};

export default Order;
