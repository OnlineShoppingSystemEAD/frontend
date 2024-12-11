import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/user/Header";
import PaymentService from "../../api/services/PaymentService";
import UserService from "../../api/services/UserService";

const Checkout = () => {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [orderDetails, setOrderDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userId = UserService.getUserId();
        const response = await UserService.getUserProfileById(userId);

        if (response?.data) {
          const { firstName, lastName, email, addressLine1, city, state, postalCode } = response.data;
          setOrderDetails({
            firstName: firstName || "",
            lastName: lastName || "",
            email: email || "",
            streetAddress: addressLine1 || "",
            city: city || "",
            state: state || "",
            zipCode: postalCode || "",
          });
        } else {
          throw new Error("User details not found");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load user details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async () => {
    try {
      const orderDetails = JSON.parse(localStorage.getItem("orderDetails"));
      const cachedTotal = JSON.parse(localStorage.getItem("cachedTotal"));
      console.log("Order Details:", orderDetails);
      console.log("Cached Total:", cachedTotal);

      const response = await PaymentService.confirmPayment(orderDetails.id, cachedTotal);
      console.log(response);
      alert("Payment successful! Redirecting to home...");
      localStorage.removeItem("orderDetails");
      localStorage.removeItem("cachedTotal");
      navigate("/");
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Failed to place the order. Please try again.");
    }
  };

  if (isLoading) {
    return (
        <div className="flex justify-center items-center h-screen">
          <p className="text-2xl text-purple-500 font-medium">Loading your details...</p>
        </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
      <div className="min-h-screen">
        <Header />
        <div className="px-32 pt-10">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-semibold">Checkout</h1>
            <div className="space-x-4">
              <button
                  className="px-4 py-2 text-white bg-black rounded-lg hover:bg-gray-700 transition-transform transform hover:scale-105"
                  onClick={() => navigate(-1)}
              >
                Back
              </button>
              <button
                  className="px-4 py-2 text-white bg-blue-700 rounded-lg hover:bg-blue-600 transition-transform transform hover:scale-105"
                  onClick={handleCheckout}
              >
                Pay
              </button>
            </div>
          </div>
          <form className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-gray-500">Personal Details</h2>
              <div className="grid grid-cols-2 gap-6">
                <input
                    type="text"
                    placeholder="First Name"
                    name="firstName"
                    value={orderDetails.firstName}
                    onChange={handleInputChange}
                    className="p-2 bg-gray-100 border rounded-lg"
                />
                <input
                    type="text"
                    placeholder="Last Name"
                    name="lastName"
                    value={orderDetails.lastName}
                    onChange={handleInputChange}
                    className="p-2 bg-gray-100 border rounded-lg"
                />
                <input
                    type="email"
                    placeholder="Email Address"
                    name="email"
                    value={orderDetails.email}
                    onChange={handleInputChange}
                    className="p-2 bg-gray-100 border rounded-lg col-span-2"
                />
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-500">Billing Address</h2>
              <div className="grid grid-cols-2 gap-6">
                <input
                    type="text"
                    placeholder="Street Address"
                    name="streetAddress"
                    value={orderDetails.streetAddress}
                    onChange={handleInputChange}
                    className="p-2 bg-gray-100 border rounded-lg"
                />
                <input
                    type="text"
                    placeholder="City"
                    name="city"
                    value={orderDetails.city}
                    onChange={handleInputChange}
                    className="p-2 bg-gray-100 border rounded-lg"
                />
                <input
                    type="text"
                    placeholder="State"
                    name="state"
                    value={orderDetails.state}
                    onChange={handleInputChange}
                    className="p-2 bg-gray-100 border rounded-lg"
                />
                <input
                    type="text"
                    placeholder="Zip Code"
                    name="zipCode"
                    value={orderDetails.zipCode}
                    onChange={handleInputChange}
                    className="p-2 bg-gray-100 border rounded-lg"
                />
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-500">Payment Method</h2>
              <select
                  className="w-full p-2 border bg-gray-100 rounded-lg"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="">Select Payment Method</option>
                <option value="credit">Credit Card</option>
                <option value="paypal">PayPal</option>
                <option value="bank">Bank Transfer</option>
              </select>
            </section>
          </form>
        </div>
      </div>
  );
};

export default Checkout;
