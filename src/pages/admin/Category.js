// Category.js
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../../styles/productList.css';
import Navbar from "../../components/admin/Navbar";
import Footer from "../../components/user/Footer";

const Category = () => {
    const location = useLocation();
    const { category } = location.state || {};

    // Array of products
    const products = [
        { id: 1, title: 'Esprit Ruffle Shirt', code: '#E001', stock: 30, supplier: 'Fashion House', price: '$16.64', category: 'Women', categoryId: 1, imageUrl: 'https://images.pexels.com/photos/6203797/pexels-photo-6203797.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', new: true },
        { id: 2, title: 'Herschel Supply', code: '#M002', stock: 50, supplier: 'Urban Outfitters', price: '$35.31', category: 'Men', categoryId: 2, imageUrl: 'https://images.pexels.com/photos/15277901/pexels-photo-15277901/free-photo-of-man-wearing-a-yellow-jacket.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
        { id: 3, title: 'Check Trouser', code: '#M003', stock: 40, supplier: 'Cloth Empire', price: '$25.50', category: 'Men', categoryId: 2, imageUrl: 'https://images.pexels.com/photos/15389752/pexels-photo-15389752/free-photo-of-portrait-of-a-man-wearing-sunglasses.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
        { id: 4, title: 'Classic Trench Coat', code: '#W004', stock: 20, supplier: 'Luxury Coats', price: '$75.00', category: 'Women', categoryId: 1, imageUrl: 'https://images.pexels.com/photos/13816061/pexels-photo-13816061.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
        { id: 5, title: 'Leather Handbag', code: '#B005', stock: 15, supplier: 'Bag Boutique', price: '$45.00', category: 'Bag', categoryId: 3, imageUrl: 'https://images.pexels.com/photos/904350/pexels-photo-904350.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
        { id: 6, title: 'Casual Shoes', code: '#S006', stock: 60, supplier: 'Foot Locker', price: '$60.00', category: 'Shoes', categoryId: 4, imageUrl: 'https://images.pexels.com/photos/13525839/pexels-photo-13525839.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
        { id: 7, title: 'Wristwatch', code: '#W007', stock: 10, supplier: 'Timepieces Ltd', price: '$150.00', category: 'Watches', categoryId: 5, imageUrl: 'https://images.pexels.com/photos/17351225/pexels-photo-17351225/free-photo-of-luxury-watch-on-an-exhibition.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    ];

    // Filter products based on the selected category ID
    const [items, setItems] = useState(products.filter(product => product.categoryId === category?.id));

    const handleStatusChange = (id, newStatus) => {
        // Update the status of the item
        setItems(items.map(item =>
            item.id === id ? { ...item, status: newStatus } : item
        ));
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar/>
            <main className="flex-grow">
                <div className="category-items-container">
                    <h1>{category?.name}</h1>
                    <div className="item-actions">
                        <button className="edit-button">Edit Item</button>
                        <button className="delete-button">Delete Item</button>
                        <button className="add-button">Add an Item</button>
                    </div>
                    <table className="item-table">
                        <thead>
                        <tr>
                            <th>Item Code</th>
                            <th>Product Name</th>
                            <th>Stock Available</th>
                            <th>Supplier</th>
                            <th>Price</th>
                            <th>Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {items.map((item) => (
                            <tr key={item.id}>
                                <td>{item.code}</td>
                                <td>{item.title}</td>
                                <td>{item.stock}</td>
                                <td>{item.supplier}</td>
                                <td>{item.price}</td>
                                <td>
                                    <select
                                        value={item.status || "Available"}
                                        onChange={(e) => handleStatusChange(item.id, e.target.value)}
                                        className="status-dropdown1">
                                        <option value="Available">Available</option>
                                        <option value="Unavailable">Unavailable</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </main>
            <Footer/>
        </div>

    );
};

export default Category;
