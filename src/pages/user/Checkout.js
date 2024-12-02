import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/user/Header";
import PaymentService from "../../api/services/Paymentervice"; // Adjust the path to your PaymentService file

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

  const navigate = useNavigate();

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setOrderDetails((prevDetails) => ({
  //     ...prevDetails,
  //     [name]: value,
  //   }));
  // };

  const handlePaymentChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleCheckout = async () => {
    if (!paymentMethod) {
      alert("Please select a payment method.");
      return;
    }

    try {

      const total = parseFloat(localStorage.getItem("cachedTotal"));

      const order = parseFloat(localStorage.getItem("orderDetails"));
      // API call to confirm payment
      const response = await PaymentService.confirmPayment( order, total);

      console.log("Payment confirmed successfully:", response);
      alert("Payment successful! Redirecting to home...");

      // Clear the cart after successful order
      localStorage.removeItem("cart");

      alert("Order placed successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error during payment confirmation:", error);
      alert("Failed to confirm payment. Please try again.");
    }
  };

  return (
      <div className="min-h-screen">
        {/* Import and display Navbar */}
        <Header />

        <div className="pl-[8cm] pr-[8cm] pt-10">
          {/* Top Section: Checkout heading on the left and buttons on the right */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-semibold">Checkout</h1>
            <div className="mr-2 space-x-8">
              <button
                  className="w-[3cm] p-2 text-xl bg-black text-white hover:text-white rounded-xl transform transition-transform hover:scale-105 hover:bg-gray-700"
                  onClick={() => navigate(-1)}
              >
                Back
              </button>
              <button
                  className="w-[3cm] p-2 text-xl text-white bg-blue-700 rounded-xl transform transition-transform hover:scale-105 hover:bg-blue-600"
                  onClick={handleCheckout}
              >
                Pay
              </button>
            </div>
          </div>

          {/* Form Section */}
          <form className="space-y-8">
            {/* Personal Details Section */}
            <div>
              <h2 className="mb-4 text-xl font-semibold text-gray-500">
                Personal Details
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-2 gap-20">
                  <input
                      type="text"
                      placeholder="First Name"
                      name="firstName"
                      value={orderDetails.firstName}
                      // onChange={handleInputChange}
                      className="p-2 bg-gray-100 border border-gray-600 rounded-2xl"
                  />
                  <input
                      type="text"
                      placeholder="Last Name"
                      name="lastName"
                      value={orderDetails.lastName}
                      // onChange={handleInputChange}
                      className="p-2 bg-gray-100 border border-gray-600 rounded-2xl"
                  />
                </div>
                <div className="grid grid-cols-2 gap-20 mt-5">
                  <input
                      type="email"
                      placeholder="Email Address"
                      name="email"
                      value={orderDetails.email}
                      // onChange={handleInputChange}
                      className="p-2 bg-gray-100 border border-gray-600 rounded-2xl"
                  />
                </div>
              </div>
            </div>

            {/* Billing Address Section */}
            <div>
              <h2 className="mb-4 text-xl font-semibold">Billing Address</h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-2 gap-20">
                  <input
                      type="text"
                      placeholder="Street Address"
                      name="streetAddress"
                      value={orderDetails.streetAddress}
                      // onChange={handleInputChange}
                      className="p-2 bg-gray-100 border border-gray-600 rounded-2xl"
                  />
                  <input
                      type="text"
                      placeholder="City"
                      name="city"
                      value={orderDetails.city}
                      // onChange={handleInputChange}
                      className="p-2 bg-gray-100 border border-gray-600 rounded-2xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-20 mt-4">
                  <input
                      type="text"
                      placeholder="State"
                      name="state"
                      value={orderDetails.state}
                      // onChange={handleInputChange}
                      className="p-2 bg-gray-100 border border-gray-600 rounded-2xl"
                  />
                  <input
                      type="text"
                      placeholder="Zip Code"
                      name="zipCode"
                      value={orderDetails.zipCode}
                      // onChange={handleInputChange}
                      className="p-2 bg-gray-100 border border-gray-600 rounded-2xl"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Section */}
            <div className="flex flex-col items-center justify-between md:flex-row">
              <div className="w-full md:w-1/2">
                <h2 className="mb-4 text-xl font-semibold ">Payment Method</h2>
                <select
                    className="w-[10cm] border border-gray-300 rounded-2xl"
                    value={paymentMethod}
                    onChange={handlePaymentChange}
                >
                  <option value="">Select Payment Method</option>
                  <option value="credit">Credit Card</option>
                  <option value="paypal">PayPal</option>
                  <option value="bank">Bank Transfer</option>
                </select>
              </div>
            </div>
          </form>
        </div>
      </div>
  );
};

export default Checkout;
