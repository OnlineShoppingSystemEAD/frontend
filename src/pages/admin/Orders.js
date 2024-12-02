// Orders.js
import React, { useState } from "react";
import Navbar from "../../components/admin/Navbar";
import Footer from "../../components/user/Footer";
import "../../styles/orderlist.css";
import {useNavigate} from "react-router-dom";

const Orders = () => {
    const orders = [
        {
            id: 1,
            orderNumber: "#0001",
            productName: "Product Description 1",
            quantity: 2,
            customerName: "Alex Kooker",
            email: "example@gmail.com",
            billingAddress: "No 32/G, Add 1, Add 2, Postal Code",
            price: "USD 75",
            status: "Paid",
            deliveryPerson: "John Doe",
        },
        {
            id: 2,
            orderNumber: "#0002",
            productName: "Product Description 2",
            quantity: 1,
            customerName: "Sarah Smith",
            email: "sarah.smith@example.com",
            billingAddress: "No 10/B, Add 3, Add 4, Postal Code",
            price: "USD 60",
            status: "On Delivery",
            deliveryPerson: "None",
        },
        {
            id: 3,
            orderNumber: "#0003",
            productName: "Product Description 3",
            quantity: 3,
            customerName: "John Doe",
            email: "john.doe@example.com",
            billingAddress: "No 56/A, Add 5, Add 6, Postal Code",
            price: "USD 90",
            status: "Packing",
            deliveryPerson: "Alice Johnson",
        },
        {
            id: 4,
            orderNumber: "#0004",
            productName: "Product Description 4",
            quantity: 4,
            customerName: "Jane Doe",
            email: "jane.doe@example.com",
            billingAddress: "No 78/C, Add 7, Add 8, Postal Code",
            price: "USD 120",
            status: "Completed",
            deliveryPerson: "Michael Brown",
        },
    ];


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

    // State to manage the selected status for each order
    const [statuses, setStatuses] = useState(orders.map(order => order.status));

    const handleStatusChange = (index, newStatus) => {
        const updatedStatuses = [...statuses];
        updatedStatuses[index] = newStatus;
        setStatuses(updatedStatuses);
    };
    const navigate = useNavigate();

    const handleOrderClick = (order) => {
        // Navigate to the order details page and pass the order ID
        navigate(`/order/${order.id}`, { state: { order } });
    };
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
                <div className="order-list-container">
                    <div className="header-row">
                        <div>Product</div>
                        <div>Description</div>
                        <div>Billing Address</div>
                        <div>Total Price</div>
                        <div className="status-column">
                            Status
                            <div className="sort-by">Sort By</div>
                        </div>
                    </div>
                    {orders.map((order, index) => (
                        <div onClick={() => handleOrderClick(order)} className="order-row" key={order.id}>
                            <div className="new-badge">{index === 0 ? "NEW" : ""}</div>
                            <div className="product-image">
                                <img
                                    src="https://i5.walmartimages.com/seo/Gildan-Adult-Short-Sleeve-Crew-T-Shirt-for-Crafting-Black-Size-L-Soft-Cotton-Classic-Fit-1-Pack-Blank-Tee_85722d56-1379-4323-b738-c05a36fc7276.57f12aa3b01118d3922bca235bd5a185.jpeg"
                                    alt="Product"
                                />
                            </div>
                            <div className="product-info">
                                <p>{order.productName}</p>
                            </div>
                            <div className="billing-info">
                                <p>{order.billingAddress}</p>
                            </div>
                            <div className="price-info">
                                <p>{order.price}</p>
                            </div>
                            <div className="status-info">
                                <CustomDropdown
                                    options={["Paid", "On Delivery", "Packing", "Completed"]}
                                    selected={statuses[index]}
                                    onChange={(e) => handleStatusChange(index, e.target.value)}
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
