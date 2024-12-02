import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { OrderService } from "../../../api/services/OrderService";

const CartSidebar = ({ isOpen, onClose }) => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  const navigate = useNavigate();

  // Function to load cart data from localStorage
  const loadCartFromStorage = () => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      const cart = JSON.parse(savedCart);
      setCartItems(cart);

      // Calculate total price
      const totalPrice = cart.reduce(
          (sum, item) => sum + item.quantity * item.price,
          0
      );
      setTotal(totalPrice);
    } else {
      setCartItems([]);
      setTotal(0);
    }
  };

  // Effect to load cart data on component mount and listen for updates
  useEffect(() => {
    loadCartFromStorage();

    // Storage event listener for cross-tab updates
    const handleStorageChange = (event) => {
      if (event.key === "cart") {
        loadCartFromStorage();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Polling mechanism to detect changes within the same tab
    const interval = setInterval(() => {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        const cart = JSON.parse(savedCart);
        if (JSON.stringify(cart) !== JSON.stringify(cartItems)) {
          setCartItems(cart);
          const totalPrice = cart.reduce(
              (sum, item) => sum + item.quantity * item.price,
              0
          );
          setTotal(totalPrice);
        }
      } else if (cartItems.length > 0) {
        setCartItems([]);
        setTotal(0);
      }
    }, 500); // Poll every 500ms

    // Cleanup on component unmount
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [cartItems]);

  // Handle Checkout
  const handleCheckout = async () => {
    try {
      // Cache the total value in localStorage
      localStorage.setItem("cachedTotal", total);

      // Prepare order data
      const orderData = {
        items: cartItems.map(({ id, quantity, price, name }) => ({
          productId: id,
          name,
          quantity,
          price,
        })),
        totalPrice: total,
      };
      // Send order data to OrderService
      const  response = await OrderService.createOrder(orderData);
      localStorage.setItem("orderDetails", response.data);

      // Clear the cart after successful order
      localStorage.removeItem("cart");
      setCartItems([]);
      setTotal(0);
      alert("Order placed successfully!");

      // Navigate to checkout page
      navigate("/checkout");
    } catch (error) {
      console.error("Error placing order:", error.message);
      alert("Failed to place order. Please try again.");
    }
  };

  return (
      <div
          className={`fixed top-0 right-0 h-full w-96 bg-white shadow-lg transform ${
              isOpen ? "translate-x-0" : "translate-x-full"
          } transition-transform duration-300 ease-in-out z-50`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Your Cart</h2>
            <button onClick={onClose} className="text-2xl text-gray-700">
              &times;
            </button>
          </div>
          <div className="space-y-6 overflow-y-auto max-h-[70vh] pr-4">
            {cartItems.length > 0 ? (
                cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4">
                      <img
                          src={item.imageURL}
                          alt={item.name}
                          className="object-cover w-20 h-20 rounded"
                      />
                      <div className="flex-1">
                        <p className="text-lg font-semibold">{item.name}</p>
                        <p className="text-gray-500">
                          {item.quantity} x ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <p className="text-lg font-semibold">
                        ${(item.quantity * item.price).toFixed(2)}
                      </p>
                    </div>
                ))
            ) : (
                <p className="text-center text-gray-500">Your cart is empty</p>
            )}
          </div>
          <div className="pt-6 mt-6 border-t">
            <div className="flex justify-between mb-6">
              <span className="text-lg font-bold">Total:</span>
              <span className="text-lg font-bold">${total.toFixed(2)}</span>
            </div>
            <div className="flex space-x-4">
              <div className="w-full py-3 text-center text-white bg-purple-600 rounded-lg hover:bg-dark transition">
                <Link to="/cart">
                  <button>VIEW CART</button>
                </Link>
              </div>
              <div className="w-full py-3 text-center text-white bg-purple-600 rounded-lg hover:bg-dark transition">
                <button onClick={handleCheckout}>CHECK OUT</button>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default CartSidebar;
