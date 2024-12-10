import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { OrderService } from "../../../api/services/OrderService";
import UserService from "../../../api/services/UserService";

const CartSidebar = ({ isOpen, onClose }) => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  // Calculate the total price
  const calculateTotal = useCallback((cart) => {
    return cart.reduce((sum, item) => sum + (item.quantity || item.itemQuantity )* (item.price || item.itemPrice ), 0);
  }, []);

  // Load cart data from localStorage
  const loadCartFromStorage = useCallback(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart && savedCart.length > 0) {
      const cart = JSON.parse(savedCart);
      setCartItems(cart);
      setTotal(calculateTotal(cart));
    } else {
      setCartItems([]);
      setTotal(0);
    }
  }, [calculateTotal]);

  // Load cart on component mount and update automatically
  useEffect(() => {
    loadCartFromStorage();

    const handleStorageChange = (event) => {
      if (event.key === "cart") {
        loadCartFromStorage();
      }
    };

    // Add event listener for cross-tab updates
    window.addEventListener("storage", handleStorageChange);

    // Poll for same-tab updates
    const interval = setInterval(() => {
      loadCartFromStorage();
    }, 500); // Poll every 500ms

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval); // Clear interval on unmount
    };
  }, [loadCartFromStorage]);

  // Handle Checkout
  const handleCheckout = async () => {
    try {
      localStorage.setItem("cachedTotal", JSON.stringify(total));

      const userId = UserService.getUserId();
      if (!userId) {
        throw new Error("User ID is not available. Please log in.");
      }

      const userResponse = await UserService.getUserProfileById(userId);
      if (!userResponse || !userResponse.data) {
        throw new Error("Failed to retrieve user profile. Please try again.");
      }

      const user = userResponse.data;
      const orderData = {
        userId,
        paymentId: null,
        shippingAddress: `${user.addressLine1 || ""} ${user.addressLine2 || ""}`.trim(),
        status: "PENDING",
        totalAmount: total,
        items: cartItems.map(({ id, itemQuantity, price, itemName }) => ({
          productId: id,
          name: itemName,
          quantity: itemQuantity,
          price: price,
        })),
      };

      const response = await OrderService.createOrder(userId, orderData);
      localStorage.setItem("orderDetails", JSON.stringify(response));

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
                          alt={item.itemName || item.name}
                          className="object-cover w-20 h-20 rounded"
                      />
                      <div className="flex-1">
                        <p className="text-lg font-semibold">{item.itemName || item.name}</p>
                        <p className="text-gray-500">
                          {item.quantity || item.itemQuantity} x ${(item.price || item.itemPrice ).toFixed(2)}
                        </p>
                      </div>
                      <p className="text-lg font-semibold">
                        ${((item.quantity || item.itemQuantity) * (item.price || item.itemPrice )).toFixed(2)}
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
              <Link to="/cart" className="w-full">
                <button className="w-full py-3 text-center text-white bg-purple-600 rounded-lg hover:bg-dark transition">
                  VIEW CART
                </button>
              </Link>
              <button
                  onClick={handleCheckout}
                  className="w-full py-3 text-center text-white bg-purple-600 rounded-lg hover:bg-dark transition"
              >
                CHECK OUT
              </button>
            </div>
          </div>
        </div>
      </div>
  );
};

export default CartSidebar;
