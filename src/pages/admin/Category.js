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

    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState("Category Name");
    const [description, setDescription] = useState("Category Description");
    const [image, setImage] = useState(null);
  
    const handleEditToggle = () => {
      setIsEditing((prev) => !prev);
    };
  
    const handleImageChange = (e) => {
      setImage(e.target.files[0]);
    };

    const handleSaveProduct = async (product) => {
        try {

    
            // If it's a new product
            if (product.isNew) {
                const savedProduct = await ProductService.createProduct({
                    categoryId: categoryId,
                    name: product.name,
                    price: product.price,
                    quantity: product.quantity,
                    status: product.status,
                    images: product.images
                });
    
                // Replace the temporary product with the saved product
                setProducts(prevProducts => 
                    prevProducts.map(p => 
                        p.isNew ? savedProduct : p
                    )
                );
            } else {
                // Existing product update
                const updatedProduct = await ProductService.updateProduct(product.id, {
                    name: product.name,
                    price: product.price,
                    quantity: product.quantity,
                    status: product.status,
                    images: product.images
                });
    
                // Update the product in the list
                setProducts(prevProducts => 
                    prevProducts.map(p => 
                        p.id === product.id ? updatedProduct : p
                    )
                );
            }
    
            // Reset editing state
            setProducts(prevProducts => 
                prevProducts.map(p => ({
                    ...p,
                    isEditing: false,
                    isNew: false
                }))
            );
    
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Failed to save product. Please try again.');
        }
    };

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
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-2xl text-purple-500 font-medium">Loading categories...</p>
            </div>
        );
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
                    <div className="flex items-center space-x-4 p-4">
                        {/* Name Input */}
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={!isEditing}
                            className={`border p-2 rounded bg-white`}
                        />

                        {/* Image Upload Input */}
                        <input
                            type="file"
                            onChange={handleImageChange}
                            disabled={!isEditing}
                            className={`border p-2 rounded bg-white`}
                        />

                        {/* Description Input */}
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={!isEditing}
                            className={`border p-2 rounded bg-white`}
                        />

                        {/* Edit/Save Button */}
                        <button
                            onClick={handleEditToggle}
                            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center"
                        >
                            {isEditing ? "✔️ Save" : "✏️ Edit"}
                        </button>
                        </div>

                        <button
                        onClick={() =>
                            setProducts((prevProducts) => [
                                ...prevProducts,
                                {
                                    id: 0, 
                                    name: '',
                                    quantity: 0,
                                    price: 0,
                                    status: 'Available',
                                    images: [],
                                    isNew: true, // Mark as a new row
                                },
                            ])
                        }
                        className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-black"
                    >
                        Add
                    </button>

                    <table className="item-table">
                        <thead>
                            <tr>
                                <th>Item Code</th>
                                <th>Product Name</th>
                                <th>Stock Available</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th>Images</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id}>
                                    <td>
                                        {product.isNew || product.isEditing ? (
                                            <input
                                                type="text"
                                                value={product.id}
                                                onChange={(e) =>
                                                    setProducts((prevProducts) =>
                                                        prevProducts.map((item) =>
                                                            item.id === product.id
                                                                ? { ...item, id: e.target.value }
                                                                : item
                                                        )
                                                    )
                                                }
                                                className="border border-gray-300 rounded px-2 py-1 text-sm max-w-[100px] w-full"
                                            />
                                        ) : (
                                            product.id
                                        )}
                                    </td>

                                    <td>
                                        {product.isNew || product.isEditing ? (
                                            <input
                                                type="text"
                                                value={product.name}
                                                onChange={(e) =>
                                                    setProducts((prevProducts) =>
                                                        prevProducts.map((item) =>
                                                            item.id === product.id
                                                                ? { ...item, name: e.target.value }
                                                                : item
                                                        )
                                                    )
                                                }
                                                className="border border-gray-300 rounded px-2 py-1 text-sm max-w-[100px] w-full"
                                            />
                                        ) : (
                                            product.name
                                        )}
                                    </td>
                                    <td>
                                        {product.isNew || product.isEditing ? (
                                            <input
                                                type="number"
                                                value={product.quantity}
                                                onChange={(e) =>
                                                    setProducts((prevProducts) =>
                                                        prevProducts.map((item) =>
                                                            item.id === product.id
                                                                ? { ...item, quantity: e.target.value }
                                                                : item
                                                        )
                                                    )
                                                }
                                                className="border border-gray-300 rounded px-2 py-1 text-sm max-w-[100px] w-full"
                                            />
                                        ) : (
                                            product.quantity
                                        )}
                                    </td>
                                    <td>
                                        {product.isNew || product.isEditing ? (
                                            <input
                                                type="number"
                                                value={product.price}
                                                onChange={(e) =>
                                                    setProducts((prevProducts) =>
                                                        prevProducts.map((item) =>
                                                            item.id === product.id
                                                                ? { ...item, price: e.target.value }
                                                                : item
                                                        )
                                                    )
                                                }
                                                className="border border-gray-300 rounded px-2 py-1 text-sm max-w-[100px] w-full"
                                            />
                                        ) : (
                                            `$${product.price}`
                                        )}
                                    </td>
                                    <td>
                                        <select
                                            value={product.status || product.quantity > 0 ? 'Available' : 'Unavailable'}
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
                                    <td>
                                        <input
                                            type="file"
                                            multiple
                                            onChange={(e) => {
                                                const files = Array.from(e.target.files);
                                                setProducts((prevProducts) =>
                                                    prevProducts.map((item) =>
                                                        item.id === product.id
                                                            ? { ...item, images: files }
                                                            : item
                                                    )
                                                );
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <div className="flex space-x-2 justify-center relative">
                                        <button
                                        onClick={() => {
                                            if (product.isNew || product.isEditing) {
                                                // If in editing mode, try to save
                                                handleSaveProduct(product);
                                            } else {
                                                // If not in editing mode, enter editing mode
                                                setProducts((prevProducts) =>
                                                    prevProducts.map((item) =>
                                                        item.id === product.id
                                                            ? { ...item, isEditing: true }
                                                            : item
                                                    )
                                                );
                                            }
                                        }}
                                        className="bg-blue-400 text-white px-2 py-1 rounded hover:bg-blue-600 relative group"
                                    >
                                        {product.isNew || product.isEditing ? '✔️' : '✏️'}
                                        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 
                                                        bg-black text-white text-xs rounded px-2 py-1 
                                                        opacity-0 group-hover:opacity-100 
                                                        transition-opacity duration-300 
                                                        whitespace-nowrap z-10">
                                                        {product.isNew || product.isEditing ? 'Save' : 'Edit'}
                                        </span>
                                    </button>

                                            <button
                                                onClick={() =>
                                                    setProducts((prevProducts) =>
                                                        prevProducts.filter((item) => item.id !== product.id)
                                                    )
                                                }
                                                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 relative group"
                                            >
                                                <span className="text-white text-xl">🗑️</span>
                                                <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    Delete
                                                </span>
                                            </button>
                                        </div>
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
