import React, { useState, useEffect } from 'react';
import '../../../styles/productOverview.css';
import Carousel from "./Carousel";
import ProductService from '../../../api/services/ProductService'; // Product service file

const carouselImages = [
    {
        src: "https://objectstorage.ap-mumbai-1.oraclecloud.com/n/softlogicbicloud/b/cdn/o/products/400-600/193664152--1--1672131753.jpeg",
    },
    {
        src: "https://objectstorage.ap-mumbai-1.oraclecloud.com/n/softlogicbicloud/b/cdn/o/products/400-600/193664152--2--1672131754.jpeg",
    },
    {
        src: "https://objectstorage.ap-mumbai-1.oraclecloud.com/n/softlogicbicloud/b/cdn/o/products/400-600/193664152--3--1672131757.jpeg",
    },
];

const ProductOverview = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [likedProducts, setLikedProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await ProductService.getCategories();
                setCategories(response.data || []);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        };
        fetchData();
    }, []);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const savedCategories = JSON.parse(localStorage.getItem('categoryList')) || [];
                setCategories(savedCategories);
                const response = await ProductService.getItems();
                setProducts(response.data || []);
            } catch (error) {
                console.error('Failed to load products or categories:', error.message);
            }finally {
                setLoading(false); // Set loading to false after fetching
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const increaseQuantity = () => setQuantity(quantity + 1);
    const decreaseQuantity = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };

    const addToCart = (product) => {
        const existingProduct = cart.find((item) => item.id === product.id);

        if (existingProduct) {
            // Update quantity for an existing product
            const updatedCart = cart.map((item) =>
                item.id === product.id
                    ? { ...item, quantity: item.quantity + quantity }
                    : item
            );
            setCart(updatedCart);
            console.log("Updated product quantity:", updatedCart);
        } else {
            // Add new product to the cart
            const newCart = [...cart, { ...product, quantity }];
            setCart(newCart);
            console.log("Added new product:", newCart);
        }

        setQuantity(1); // Reset quantity
        console.log("Current cart state:", cart);
    };


    const removeFromCart = (productId) => {
        setCart(cart.filter((item) => item.id !== productId));
    };

    const filteredProducts = selectedCategoryId
        ? products.filter(product => product.categoryId === selectedCategoryId)
        : products;

    const toggleLike = (productId) => {
        if (likedProducts.includes(productId)) {
            setLikedProducts(likedProducts.filter(id => id !== productId));
        } else {
            setLikedProducts([...likedProducts, productId]);
        }
    };

    const openQuickView = (product) => {
        setSelectedProduct(product);
        setQuantity(1); // Reset quantity when opening Quick View
        setIsModalOpen(true);
    };

    const closeQuickView = () => {
        console.log('Closing modal');
        setSelectedProduct(null);
        setIsModalOpen(false);
    };

    if (loading) {
        return (
            <div className="loading-container">
                <p className="loading-text">Loading products...</p>
            </div>
        );
    }

    return (
        <div className="product-overview">
            <header className="product-header">
                <h1>PRODUCT OVERVIEW</h1>
                <div className="product-categories">
                    <span
                        className={selectedCategoryId === null ? 'active' : ''}
                        onClick={() => setSelectedCategoryId(null)}
                    >
                        All Products
                    </span>
                    {categories.map((category) => (
                        <span
                            key={category.id}
                            className={selectedCategoryId === category.id ? 'active' : ''}
                            onClick={() => setSelectedCategoryId(category.id)}>
                            {category.name}
                        </span>
                    ))}
                </div>
            </header>

            <div className="product-grid">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <div key={product.id} className="product-card">
                            <div className="product-image-wrapper">
                                {product.new && <span className="new-badge">New</span>}
                                <img src={product.imageURL} alt={product.name} className="product-image" />
                                <button className="quick-view-btn" onClick={() => openQuickView(product)}>
                                    Quick View
                                </button>
                            </div>
                            <div className="product-info">
                                <h3>{product.name}</h3>
                                <p>Price: ${product.price}</p>
                                <div className="like-icon" onClick={() => toggleLike(product.id)}>
                                    <i className={likedProducts.includes(product.id) ? 'fas fa-heart liked' : 'far fa-heart'}></i>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No products found in this category.</p>
                )}
            </div>

            {/* Modal */}
{isModalOpen && selectedProduct && (
    <div
        className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={closeQuickView}
    >
        <div
            className="modal-content bg-white rounded-lg shadow-lg w-11/12 max-w-4xl sm:max-w-3xl md:max-w-2xl lg:max-w-5xl xl:max-w-6xl flex flex-col md:flex-row gap-8 p-6 relative"
            onClick={(e) => e.stopPropagation()}
        >
            <span
                className="close-modal absolute top-4 right-4 text-gray-600 text-2xl cursor-pointer hover:text-gray-800"
                onClick={closeQuickView}
            >
                &times;
            </span>

            <div className="quick-view-container flex flex-col md:flex-row gap-8 w-full">
                {/* Image Carousel (Left Side) */}
                <div className="quick-view-image md:w-1/2">
                    <Carousel
                        images={carouselImages.map((img) => img.src)} // Map to extract src
                        isModalOpen={true}
                    />
                </div>

                {/* Product Details (Right Side) */}
                <div className="quick-view-details md:w-1/2 flex flex-col gap-6">
                    <h2 className="text-3xl font-bold text-gray-800">{selectedProduct.name}</h2>
                    <p className="product-price text-xl text-gray-600">Price: ${selectedProduct.price}</p>

                    {/* Quantity Controls */}
                    <div className="quantity-add flex flex-col gap-6">
                        <div className="quantity-controls flex items-center gap-6">
                            <button
                                onClick={decreaseQuantity}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-2 py-1 rounded"
                            >
                                -
                            </button>
                            <input
                                type="number"
                                value={quantity}
                                readOnly
                                className="w-16 text-center border border-gray-300 rounded"
                            />
                            <button
                                onClick={increaseQuantity}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-2 py-1 rounded"
                            >
                                +
                            </button>
                        </div>

                        {/* Add to Cart and Remove from Cart Buttons */}
                        <div className="flex gap-6">
                            <button
                                className="add-cart-btn bg-blue-500 hover:bg-blue-600 text-white font-semibold px-2 py-2 rounded"
                                onClick={() => addToCart(selectedProduct)}
                            >
                                ADD TO CART
                            </button>
                            <button
                                className="remove-cart-btn bg-red-500 hover:bg-red-600 text-white font-semibold px-2 py-2 rounded"
                                onClick={() => removeFromCart(selectedProduct.id)}
                            >
                                REMOVE FROM CART
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
)}


        </div>
    );
};

export default ProductOverview;
