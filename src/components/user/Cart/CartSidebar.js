import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { OrderService } from "../../../api/services/OrderService";
import userService from "../../../api/services/UserService";
import UserService from "../../../api/services/UserService";

const CartSidebar =  ({isOpen, onClose}) => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  // Calculate the total price
  const calculateTotal = useCallback((cart) => {
    return cart.reduce((sum, item) => sum + item.quantity * item.price, 0);
  }, []);

  // Load cart data from localStorage
  const loadCartFromStorage = useCallback(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      const cart = JSON.parse(savedCart);
      setCartItems(cart);
      setTotal(calculateTotal(cart));
    } else {
      setCartItems([]);
      setTotal(0);
    }
  }, [calculateTotal]);

  useEffect(() => {
    // Load cart data on component mount
    loadCartFromStorage();

    // Storage event listener for cross-tab updates
    const handleStorageChange = (event) => {
      if (event.key === "cart") {
        loadCartFromStorage();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [loadCartFromStorage]);

  // Update cart automatically when localStorage changes in the same tab
  useEffect(() => {
    const interval = setInterval(() => {
      const savedCart = localStorage.getItem("cart");
      const cart = savedCart ? JSON.parse(savedCart) : [];
      const newTotal = calculateTotal(cart);

      if (JSON.stringify(cart) !== JSON.stringify(cartItems) || total !== newTotal) {
        setCartItems(cart);
        setTotal(newTotal);
      }
    }, 500); // Check for updates every 500ms

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [cartItems, total, calculateTotal]);

  // Handle Checkout
  const handleCheckout = async () => {
    try {
      // Save the total amount to localStorage
      localStorage.setItem("cachedTotal", JSON.stringify(total)); // Ensure total is saved as a string

      // Get the user ID and profile
      const userId = UserService.getUserId();
      if (!userId) {
        throw new Error("User ID is not available. Please log in.");
      }

      const userResponse = await UserService.getUserProfileById(userId);
      if (!userResponse || !userResponse.data) {
        throw new Error("Failed to retrieve user profile. Please try again.");
      }

      const user = userResponse.data;

      // Construct the order data
      const orderData = {
        userId: userId,
        paymentId: null,
        shippingAddress: `${user.addressLine1 || ""} ${user.addressLine2 || ""}`,
        status: "PENDING",
        totalAmount: total,
        items: cartItems.map(({ id, quantity, price, name }) => ({
          productId: id,
          name,
          quantity,
          price,
        })),
      };

      // Create the order
      const response = await OrderService.createOrder(userId, orderData);
      console.log("Order response:", response);

      // Save the order response to localStorage
      localStorage.setItem("orderDetails", JSON.stringify(response));

      // Verify the saved data
      const savedOrderDetails = JSON.parse(localStorage.getItem("orderDetails"));
      const savedTotal = JSON.parse(localStorage.getItem("cachedTotal"));
      console.log("Saved Order Details:", savedOrderDetails);
      console.log("Saved Total Details:", savedTotal);

      // Clear the cart after successful order creation
      localStorage.removeItem("cart");
      setCartItems([]);
      setTotal(0);

      alert("Order placed successfully!");
      navigate("/checkout");
    } catch (error) {
      console.error("Error placing order:", error.message || error);
      alert(error.message || "Failed to place order. Please try again.");
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
