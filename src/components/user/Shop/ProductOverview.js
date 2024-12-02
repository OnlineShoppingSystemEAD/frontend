import React, { useState, useEffect } from 'react';
import '../../../styles/productOverview.css';
import Carousel from "../Home/Carousel";
import ProductService from '../../../api/services/ProductService'; // Assuming this is the service file

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
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const savedCategories = JSON.parse(localStorage.getItem('categoryList')) || [];
                setCategories(savedCategories);
                const response = await ProductService.getItems();
                setProducts(response.data || []);
            } catch (error) {
                console.error('Failed to load products or categories:', error.message);
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
                            onClick={() => setSelectedCategoryId(category.id)}
                        >
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
                <div className="modal-overlay" onClick={closeQuickView}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <span className="close-modal" onClick={closeQuickView}>&times;</span>
                        <div className="quick-view-container">
                            <div className="quick-view-image">
                                <Carousel images={carouselImages} />
                            </div>
                            <div className="quick-view-details">
                                <h2>{selectedProduct.name}</h2>
                                <p className="product-price">Price: ${selectedProduct.price}</p>
                                <div className="quantity-add">
                                    <button onClick={decreaseQuantity}>-</button>
                                    <input type="number" value={quantity} readOnly />
                                    <button onClick={increaseQuantity}>+</button>
                                    <button
                                        className="add-cart-btn"
                                        onClick={() => addToCart(selectedProduct)}
                                    >
                                        ADD TO CART
                                    </button>
                                    <button
                                        className="remove-cart-btn"
                                        onClick={() => removeFromCart(selectedProduct.id)}
                                    >
                                        REMOVE FROM CART
                                    </button>
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
