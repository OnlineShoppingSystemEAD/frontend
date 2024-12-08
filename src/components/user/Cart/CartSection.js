import React, { useEffect, useState } from "react";
import { ShoppingCartService } from "../../../api/services/OrderService"; 

const CartSection = () => {
  const [cartItems, setCartItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [selectedCountry, setSelectedCountry] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [state, setState] = useState("");

  // List of countries
  const countries = ["United States", "Canada", "United Kingdom", "Australia", "India"];

  useEffect(() => {
    const loadCartData = async () => {
      try {
        const decodedTokenString = localStorage.getItem("decodedToken");
        if (!decodedTokenString) {
          console.error("No decoded token found in localStorage.");
          return;
        }

        const decodedToken = JSON.parse(decodedTokenString);
        if (!decodedToken.userId) {
          console.error("User ID is missing in the token.");
          return;
        }

        const userId = decodedToken.userId;

        // Fetch cart data for the user
        const cartData = await ShoppingCartService.getShoppingCartByUserId(userId);
        console.log(cartData);
        setCartItems(cartData);

        // Initialize quantities based on cart data
        const initialQuantities = {};
        cartData.forEach((item) => {
          initialQuantities[item.id] = item.itemQuantity;
        });
        setQuantities(initialQuantities);
      } catch (error) {
        console.error("Error loading cart data:", error);
      }
    };

    loadCartData();
  }, []);

  const increaseQuantity = (productId) => {
    setQuantities((prev) => ({ ...prev, [productId]: prev[productId] + 1 }));
  };

  const decreaseQuantity = (productId) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(prev[productId] - 1, 0),
    }));
  };

  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
  };

  const handleZipcodeChange = (event) => {
    setZipcode(event.target.value);
  };

  const handleStateChange = (event) => {
    setState(event.target.value);
  };

  return (
    <form>
    <div>
      <div className="flex justify-between">
        <div className="m-4 rounded-xl">
          <table className="w-full border border-collapse border-gray-300">
            <thead>
              <tr>
                <th className="p-2 border-b border-gray-400">PRODUCT</th>
                <th className="p-2 border-b border-gray-400">PRICE</th>
                <th className="p-2 border-b border-gray-400">QUANTITY</th>
                <th className="p-2 border-b border-gray-400">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id}>
                  <td className="p-2 text-center border-b border-gray-400">
                    <img
                      src={item.imageURL}
                      alt={item.itemName}
                      className="inline-block w-12 h-12 mr-2"
                    />
                    <br />
                    {item.itemName}
                  </td>
                  <td className="p-2 text-center border-b border-gray-400">
                    ${item.itemPrice}
                  </td>
                  <td className="p-2 text-center border-b border-gray-400">
                    <div className="flex items-center justify-center">
                      <button
                        onClick={(event) => {
                          event.preventDefault();
                          decreaseQuantity(item.id);
                        }}
                        className="px-2 border border-gray-400"
                      >
                        -
                      </button>
                      <span className="mx-2">{quantities[item.id]}</span>
                      <button
                        onClick={(event) => {
                          event.preventDefault();
                          increaseQuantity(item.id);
                        }}
                        className="px-2 border border-gray-400"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="p-2 text-center border-b border-gray-400">
                    ${item.itemPrice * quantities[item.id]}
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
              ${cartItems.reduce((total, item) => total + item.itemPrice * quantities[item.id], 0)}
            </div>
          </div>
          <hr />
          <div className="mt-4">
            <h3 className="text-lg text-gray-600 mb-2">Shipping:</h3>
            <p className="text-gray-600 text-sm">
              There are no shipping methods available. Please double-check your address, or contact us if you need any help.
            </p>
          </div>
  
          <div className="mt-6">
            <h3 className="text-lg text-gray-600 mb-2">CALCULATE SHIPPING</h3>
            <select
              value={selectedCountry}
              onChange={handleCountryChange}
              className="p-2 mb-4 border border-gray-300 rounded-md w-full"
            >
              <option value="">-- Choose a Country --</option>
              {countries.map((country, index) => (
                <option key={index} value={country}>
                  {country}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={state}
              onChange={handleStateChange}
              placeholder="Enter State"
              className="w-full p-2 mb-4 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              value={zipcode}
              onChange={handleZipcodeChange}
              placeholder="Enter Zip Code"
              className="w-full p-2 mb-4 border border-gray-300 rounded-md"
            />
            <button className="w-full py-2 mb-4 text-white bg-dark rounded-lg hover:bg-purple-500 transition">
              Update Total
            </button>
            <button className="w-full py-2 text-white bg-purple-500 rounded-lg hover:bg-dark transition">
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  </form>
  
  );
};

export default CartSection;
