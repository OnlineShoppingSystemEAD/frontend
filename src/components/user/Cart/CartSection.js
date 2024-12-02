import React, { useEffect, useState } from "react";
import { ShoppingCartService } from "../../../api/services/OrderService"; // Adjust the path

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
          <div className="flex justify-between mt-20 h-[25cm]">
            <div className="m-10 ml-44 mb-[6.5cm] h-[13cm] rounded-xl ">
              <table className="w-[20cm] h-[10cm] border border-collapse border-gray-300 mt-0">
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
                            src={item.imageURL} // Dynamically load image from API data
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
            <div className="border border-gray-300 w-[12cm] h-[20cm] mr-[4cm] rounded-xl p-5 mt-9">
              <h2 className="mt-5 ml-10">CART TOTALS</h2>
              <div className="flex">
                <h3 className="m-2 ml-10 text-lg text-gray-600">Subtotals:</h3>
                <div className="m-2 text-lg text-gray-600 ml-14">
                  ${cartItems.reduce((total, item) => total + item.itemPrice * quantities[item.id], 0)}
                </div>
              </div>
              <hr />
              <div className="h-[auto]">
                <div className="flex items-start m-2 mt-6 ml-10">
                  <h3 className="text-lg text-gray-600">Shipping:</h3>
                  <p className="ml-2 text-lg text-gray-600">
                    There are no shipping methods available. Please double-check
                    your address, or contact us if you need any help.
                  </p>
                </div>
                <div>
                  <div className="flex-col items-center h-[400px] ml-10 text-[120%] p-6 pr-1">
                    <p className="m-2 ml-10 text-lg text-gray-600">
                      CALCULATE SHIPPING
                    </p>
                    <select
                        value={selectedCountry}
                        onChange={handleCountryChange}
                        className="p-2 border border-gray-300 rounded-md"
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
                        className="w-full p-2 mt-4 text-lg text-gray-600 border border-gray-300 rounded-md"
                    />
                    <input
                        type="text"
                        value={zipcode}
                        onChange={handleZipcodeChange}
                        placeholder="Enter Zip Code"
                        className="w-full p-2 mt-4 border border-gray-300 rounded-md"
                    />
                    <button className="w-auto px-6 py-2 mt-5 text-lg font-semibold text-gray-600 transition duration-300 ease-in-out bg-gray-200 rounded-full shadow hover:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">
                      Update Total
                    </button>
                    <div className="mt-8">
                      <button className="p-2 mt-5 w-[8cm] text-lg font-semibold text-white transition duration-300 ease-in-out bg-black shadow rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">
                        Proceed to Checkout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
  );
};

export default CartSection;
