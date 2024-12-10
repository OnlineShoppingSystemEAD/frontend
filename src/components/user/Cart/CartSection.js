import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { OrderService } from "../../../api/services/OrderService";
import UserService from "../../../api/services/UserService";

const CartSection = () => {
  const [cartItems, setCartItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [selectedCountry, setSelectedCountry] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [state, setState] = useState("");
  const navigate = useNavigate();
  const countries = ["United States", "Canada", "United Kingdom", "Australia", "India"];

  const loadCartFromStorage = useCallback(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      const cart = JSON.parse(savedCart);
      setCartItems(cart);

      const initialQuantities = {};
      cart.forEach((item) => {
        initialQuantities[item.id] = item.quantity;
      });
      setQuantities(initialQuantities);
    } else {
      setCartItems([]);
    }
  }, []);

  useEffect(() => {
    loadCartFromStorage();

    const handleStorageChange = (event) => {
      if (event.key === "cart") {
        loadCartFromStorage();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [loadCartFromStorage]);

  const updateCartInLocalStorage = (updatedCart) => {
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const increaseQuantity = (productId) => {
    const updatedCart = cartItems.map((item) =>
      item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCartItems(updatedCart);
    setQuantities((prev) => ({ ...prev, [productId]: prev[productId] + 1 }));
    updateCartInLocalStorage(updatedCart);
  };

  const decreaseQuantity = (productId) => {
    const updatedCart = cartItems.map((item) =>
      item.id === productId
        ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
        : item
    );
    setCartItems(updatedCart);
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(prev[productId] - 1, 1),
    }));
    updateCartInLocalStorage(updatedCart);
  };

  const removeItem = (productId) => {
    const updatedCart = cartItems.filter((item) => item.id !== productId);
    setCartItems(updatedCart);
    const updatedQuantities = { ...quantities };
    delete updatedQuantities[productId];
    setQuantities(updatedQuantities);
    updateCartInLocalStorage(updatedCart);
  };

  const handleCheckout = async () => {
    try {
      const total = cartItems.reduce(
        (sum, item) => sum + item.price * quantities[item.id],
        0
      );

      const userId = UserService.getUserId();
      const user = await UserService.getUserProfileById(userId);

      const orderData = {
        userId: userId,
        paymentId: null,
        shippingAddress: `${user.data.addressLine1} ${user.data.addressLine2}`,
        status: "PENDING",
        totalAmount: total,
        items: cartItems.map(({ id, quantity, price, name }) => ({
          productId: id,
          name,
          quantity,
          price,
        })),
      };

      const response = await OrderService.createOrder(userId, orderData);
      localStorage.setItem("orderDetails", JSON.stringify(response));

      localStorage.removeItem("cart");
      setCartItems([]);
      localStorage.setItem("cachedTotal", total);
      alert("Order placed successfully!");
      navigate("/checkout");
    } catch (error) {
      console.error("Error placing order:", error.message);
      alert("Failed to place order. Please try again.");
    }
  };

  return (
    <form>
      {/* Added responsive layout with flex and grid */}
      <div className="flex flex-col lg:flex-row gap-6 m-4">
        <div className="w-full lg:w-2/3 rounded-xl shadow-lg">
          <table className="w-full border border-collapse border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border-b border-gray-400">PRODUCT</th>
                <th className="p-2 border-b border-gray-400">PRICE</th>
                <th className="p-2 border-b border-gray-400">QUANTITY</th>
                <th className="p-2 border-b border-gray-400">TOTAL</th>
                <th className="p-2 border-b border-gray-400">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="p-2 text-center border-b border-gray-400 flex items-center space-x-4">
                    <img
                      src={item.imageURL}
                      alt={item.name}
                      className="inline-block w-16 h-16 rounded-lg"
                    />
                    <span className="text-lg">{item.name}</span>
                  </td>
                  <td className="p-2 text-center border-b border-gray-400">
                    ${item.price.toFixed(2)}
                  </td>
                  <td className="p-2 text-center border-b border-gray-400">
                    <div className="flex items-center justify-center">
                      <button
                        onClick={(event) => {
                          event.preventDefault();
                          decreaseQuantity(item.id);
                        }}
                        className="px-2 border border-gray-400 rounded-l"
                      >
                        -
                      </button>
                      <span className="mx-2">{quantities[item.id]}</span>
                      <button
                        onClick={(event) => {
                          event.preventDefault();
                          increaseQuantity(item.id);
                        }}
                        className="px-2 border border-gray-400 rounded-r"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="p-2 text-center border-b border-gray-400">
                    ${(item.price * quantities[item.id]).toFixed(2)}
                  </td>
                  <td className="p-2 text-center border-b border-gray-400">
                    <button
                      onClick={(event) => {
                        event.preventDefault();
                        removeItem(item.id);
                      }}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="w-full lg:w-1/3 border border-gray-300 rounded-xl p-5 shadow-lg">
          <h2 className="mt-2 mb-4 text-center text-2xl font-semibold">CART TOTALS</h2>
          <div className="flex justify-between mb-4">
            <h3 className="text-lg text-gray-600">Subtotals:</h3>
            <div className="text-lg text-gray-600">
              ${cartItems.reduce((total, item) => total + item.price * quantities[item.id], 0).toFixed(2)}
            </div>
          </div>
          <hr />
          <div className="mt-4">
            <h3 className="text-lg text-gray-600 mb-2">Shipping:</h3>
            <p className="text-gray-600 text-sm">
              There are no shipping methods available. Please double-check your address or contact us if you need help.
            </p>
          </div>
          <div className="mt-6">
            <button
              onClick={(event) => {
                event.preventDefault();
                handleCheckout();
              }}
              className="w-full py-2 text-white bg-purple-500 rounded-lg hover:bg-purple-700 transition"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CartSection;
