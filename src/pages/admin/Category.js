import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../../styles/productList.css';
import Navbar from "../../components/admin/Navbar";
import Footer from "../../components/user/Footer";
import ProductService from '../../api/services/ProductService';
import CategoryService from '../../api/services/ProductService';
import userService from "../../api/services/UserService";

const Category = () => {
    const { categoryId } = useParams(); // Retrieve categoryId from the URL
    const [products, setProducts] = useState([]); // Products state
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState("Category Name");
    const [description, setDescription] = useState("Category Description");
    const [image, setImage] = useState(null);

    const handleEditToggle = async () => {
        const userId = userService.getUserId();
        let response = ''
        if (isEditing) {
            try {
                if (categoryId === "0") {
                    // Create category
                    response = await CategoryService.createCategory(
                        { name, description },
                        image,
                        userId,
                        "ADMIN"
                    );
                } else {
                    // Update category
                    response = await CategoryService.updateCategory(
                        categoryId,
                        { name, description },
                        image,
                        userId,
                        "ADMIN"
                    );
                }
                alert("Category saved successfully!");
                console.log(response);
            } catch (error) {
                console.error("Error saving category:", error);
                alert("Failed to save category. Please try again.");
            }
        }
        setIsEditing((prev) => !prev);
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSaveProduct = async (product) => {
        try {
            if (!product) {
                throw new Error("Product object is undefined");
            }

            // Ensure images is always an array
            const images = Array.isArray(product.images) ? product.images : [];
            images.forEach((image) => {
                console.log("Processing image:", image);
            });

            if (product.isNew) {
                const savedProduct = await ProductService.createItem({
                    categoryId,
                    name: product.name,
                    price: product.price,
                    quantity: product.quantity,
                    status: product.status,
                    images,
                });
                setProducts((prevProducts) =>
                    prevProducts.map((p) => (p.isNew ? savedProduct : p))
                );
            } else {
                const updatedProduct = await ProductService.updateItem(product.id, {
                    name: product.name,
                    price: product.price,
                    quantity: product.quantity,
                    status: product.status,
                    images,
                });
                setProducts((prevProducts) =>
                    prevProducts.map((p) => (p.id === product.id ? updatedProduct : p))
                );
            }

            setProducts((prevProducts) =>
                prevProducts.map((p) => ({
                    ...p,
                    isEditing: false,
                    isNew: false,
                }))
            );
        } catch (error) {
            console.error("Error saving product:", error);
            alert("Failed to save product. Please try again.");
        }
    };


    const handleDeleteProduct = async (productId) => {
        try {
            await ProductService.deleteProduct(productId);
            setProducts((prevProducts) =>
                prevProducts.filter((product) => product.id !== productId)
            );
        } catch (error) {
            console.error("Error deleting product:", error);
            alert("Failed to delete product. Please try again.");
        }
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await ProductService.getProductsByCategory(categoryId, 0, 16);
                setProducts(response || []);
            } catch (err) {
                setError("Failed to load products. Please try again later.");
                console.error("Error fetching products:", err.message);
            } finally {
                setLoading(false);
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
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={!isEditing}
                            className="border p-2 rounded bg-white"
                        />

                        <input
                            type="file"
                            onChange={handleImageChange}
                            disabled={!isEditing}
                            className="border p-2 rounded bg-white"
                        />

                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={!isEditing}
                            className="border p-2 rounded bg-white"
                        />

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
                                    id: 0, // Default ID for a new product
                                    name: '', // Empty name for a new product
                                    description: '', // Empty description
                                    price: 0.0, // Default price
                                    quantity: 0, // Default quantity
                                    categoryId: parseInt(categoryId, 10), // Use the categoryId from the current context
                                    imageURL: '', // Empty primary image URL
                                    otherImageURLs: [], // Empty list for other image URLs
                                    isNew: true, // Mark as a new product
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
                                                    console.log("pro:");
                                                    for (const key in product) {
                                                        if (Object.hasOwnProperty.call(product, key)) {
                                                            console.log(`${key}: ${product[key]}`);
                                                        }
                                                    }

                                                    handleSaveProduct(product);
                                                } else {
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
                                        </button>

                                        <button
                                            onClick={() => handleDeleteProduct(product.id)}
                                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 relative group"
                                        >
                                            <span className="text-white text-xl">🗑️</span>
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
