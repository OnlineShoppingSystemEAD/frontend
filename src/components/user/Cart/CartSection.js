import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCartService, OrderService } from "../../../api/services/OrderService";
import UserService from "../../../api/services/UserService";

const CartSection = () => {
  const [cartItems, setCartItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const updateCartInLocalStorage = (updatedCart) => {
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const initializeQuantities = (cart) => {
    const initialQuantities = {};
    cart.forEach((item) => {
      initialQuantities[item.id] = (item.itemQuantity || item.quantity) || 1;
    });
    setQuantities(initialQuantities);
  };

  const loadCartFromStorageOrBackend = useCallback(async () => {
    const savedCart = localStorage.getItem("cart");
    console.log("Saved Cart Data:", savedCart);
    if (savedCart && savedCart.length > 0 ) {
      const cart = JSON.parse(savedCart);
      setCartItems(cart);
      initializeQuantities(cart);
    } else {
      try {
        const userId = UserService.getUserId();
        const backendCart = await ShoppingCartService.getShoppingCartByUserId(userId);
        console.log("Backend Cart Data:", backendCart);

        if (backendCart && backendCart.length > 0) {
          setCartItems(backendCart);
          initializeQuantities(backendCart);
          updateCartInLocalStorage(backendCart);
        } else {
          console.log("No items in backend cart.");
          setCartItems([]);
        }
      } catch (error) {
        console.error("Error loading cart from backend:", error.message);
        setCartItems([]);
      }
    }
  }, []);

  useEffect(() => {
    loadCartFromStorageOrBackend();

    const handleStorageChange = (event) => {
      if (event.key === "cart") {
        loadCartFromStorageOrBackend();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [loadCartFromStorageOrBackend]);

  const modifyCartItem = async (productId, quantityChange) => {
    if (loading) return; // Prevent multiple simultaneous requests
    setLoading(true);

    const updatedCart = cartItems.map((item) =>
        item.id === productId
            ? { ...item, itemQuantity: Math.max(((item.itemQuantity || item.quantity) || 1) + quantityChange, 1) }
            : item
    );
    setCartItems(updatedCart);
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max((prev[productId] || 1) + quantityChange, 1),
    }));
    updateCartInLocalStorage(updatedCart);

    try {
      const updatedItem = updatedCart.find((item) => item.id === productId);
      await ShoppingCartService.updateShoppingCart(productId, updatedItem.itemQuantity);
      console.log(`Cart item ${productId} updated successfully.`);
    } catch (error) {
      console.error(`Error updating cart item ${productId}:`, error.message);
      alert("Failed to update the cart. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (productId) => {
    if (!window.confirm("Are you sure you want to remove this item from the cart?")) {
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      const userId = await UserService.getUserId();
      const response = await ShoppingCartService.deleteItemFromShoppingCart(productId);
      console.log(response)
      console.log(`Item ${productId} removed from the backend cart.`);
      const updatedCart = cartItems.filter((item) => item.id !== productId);
      setCartItems(updatedCart);
      const updatedQuantities = { ...quantities };
      delete updatedQuantities[productId];
      setQuantities(updatedQuantities);
      updateCartInLocalStorage(updatedCart);

    } catch (error) {
      console.error(`Error removing cart item ${productId}:`, error.message);
      alert("Failed to remove the item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    const total = cartItems.reduce(
        (sum, item) => sum + (item.price || item.itemPrice || 0) * (quantities[item.id] || 1),
        0
    );
    const userId = UserService.getUserId();

    if (loading) return;
    setLoading(true);

    try {
      const user = await UserService.getUserProfileById(userId);
      const orderData = {
        userId,
        paymentId: null,
        shippingAddress: `${user.data.addressLine1} ${user.data.addressLine2}`,
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
      localStorage.setItem("cachedTotal", JSON.stringify(total));
      localStorage.setItem("orderDetails", JSON.stringify(response));
      localStorage.removeItem("cart");
      console.log("Cart Removed")
      setCartItems([]);
      alert("Order placed successfully!");
      navigate("/checkout");
    } catch (error) {
      console.error("Error placing order:", error.message);
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
      <form>
        <div className="flex justify-between">
          <div className="m-4 rounded-xl">
            <table className="w-full border border-collapse border-gray-300">
              <thead>
              <tr>
                <th className="p-2 border-b border-gray-400">PRODUCT</th>
                <th className="p-2 border-b border-gray-400">PRICE</th>
                <th className="p-2 border-b border-gray-400">QUANTITY</th>
                <th className="p-2 border-b border-gray-400">TOTAL</th>
                <th className="p-2 border-b border-gray-400">ACTIONS</th>
              </tr>
              </thead>
              <tbody>
              {cartItems.map((item) => (
                  <tr key={item.id}>
                    <td className="p-2 text-center border-b border-gray-400 flex items-center space-x-4">
                      <img
                          src={item.imageURL}
                          alt={item.itemName || item.name}
                          className="w-20 h-20 rounded-lg"
                      />
                      <span>{item.itemName || item.name}</span>
                    </td>
                    <td className="p-2 text-center border-b border-gray-400">
                      ${item.price || item.itemPrice ? (item.price || item.itemPrice).toFixed(2) : "0.00"}
                    </td>
                    <td className="p-2 text-center border-b border-gray-400">
                      <div className="flex items-center justify-center">
                        <button
                            onClick={(event) => {
                              event.preventDefault();
                              modifyCartItem(item.id, -1);
                            }}
                            className="px-2 border border-gray-400"
                            disabled={loading}
                        >
                          -
                        </button>
                        <span className="mx-2">{quantities[item.id] || 1}</span>
                        <button
                            onClick={(event) => {
                              event.preventDefault();
                              modifyCartItem(item.id, 1);
                            }}
                            className="px-2 border border-gray-400"
                            disabled={loading}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="p-2 text-center border-b border-gray-400">
                      ${(item.price || item.itemPrice) && quantities[item.id]
                        ? ((item.price || item.itemPrice) * quantities[item.id]).toFixed(2)
                        : "0.00"}
                    </td>
                    <td className="p-2 text-center border-b border-gray-400">
                      <button
                          onClick={(event) => {
                            event.preventDefault();
                            removeItem(item.id);
                          }}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                          disabled={loading}
                      >
                        {loading ? "Processing..." : "Remove"}
                      </button>
                    </td>
                  </tr>
              ))}
              </tbody>
            </table>
          </div>
          <div className="border border-gray-300 w-[12cm] rounded-xl p-5 m-4">
            <h2 className="mt-2 mb-4 text-center">CART TOTALS</h2>
            <div className="flex justify-between mb-4">
              <h3 className="text-lg text-gray-600">Subtotals:</h3>
              <div className="text-lg text-gray-600">
                $
                {cartItems
                    .reduce(
                        (total, item) =>
                            total + (item.price || item.itemPrice || 0) * (quantities[item.id] || 1),
                        0
                    )
                    .toFixed(2)}
              </div>
            </div>
            <hr />
            <div className="mt-4">
              <h3 className="text-lg text-gray-600 mb-2">Shipping:</h3>
              <p className="text-gray-600 text-sm">
                There are no shipping methods available. Please double-check your
                address or contact us for assistance.
              </p>
            </div>
            <div className="mt-6">
              <button
                  onClick={(event) => {
                    event.preventDefault();
                    handleCheckout();
                  }}
                  className="w-full py-2 text-white bg-purple-500 rounded-lg hover:bg-dark transition"
                  disabled={loading}
              >
                {loading ? "Processing..." : "Proceed to Checkout"}
              </button>
            </div>
          </div>
        </div>
      </form>
  );
};

export default CartSection;
