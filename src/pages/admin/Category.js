import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../../styles/productList.css';
import Navbar from "../../components/admin/Navbar";
import Footer from "../../components/user/Footer";
import ProductService from '../../api/services/ProductService';

const Category = () => {
    const { categoryId } = useParams(); // Retrieve categoryId from the URL
    const [products, setProducts] = useState([]); // Products state
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

    // Fetch products based on categoryId
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true); // Start loading
                const response = await ProductService.getProductsByCategory(categoryId, 0, 16);
                console.log(response);
                setProducts(response || []); // Set products state
            } catch (err) {
                setError("Failed to load products. Please try again later.");
                console.error("Error fetching products:", err.message);
            } finally {
                setLoading(false); // End loading
            }
        };

        fetchProducts();
    }, [categoryId]);

    if (loading) {
        return <div className="p-6 text-center">Loading products...</div>;
    }

    if (error) {
        return <div className="p-6 text-center text-red-500">{error}</div>;
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
                <div className="category-items-container">
                    <h1>Products in Category {categoryId}</h1>
                    <table className="item-table">
                        <thead>
                        <tr>
                            <th>Item Code</th>
                            <th>Product Name</th>
                            <th>Stock Available</th>
                            <th>Price</th>
                            <th>Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {products.map((product) => (
                            <tr key={product.id}>
                                <td>{product.id}</td>
                                <td>{product.name}</td>
                                <td>{product.quantity}</td>
                                <td>${product.price}</td>
                                <td>
                                    <select
                                        value={product.quantity > 0 ? "Available" : "Unavailable"}
                                        onChange={(e) =>
                                            setProducts((prevProducts) =>
                                                prevProducts.map((item) =>
                                                    item.id === product.id
                                                        ? { ...item, status: e.target.value }
                                                        : item
                                                )
                                            )
                                        }
                                        className="status-dropdown"
                                    >
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
            <Footer />
        </div>
    );
};

export default Category;
