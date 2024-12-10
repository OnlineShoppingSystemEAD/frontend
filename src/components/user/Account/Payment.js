import React, { useState } from 'react';
import PaymentService from "../../../api/services/PaymentService";

const Payment = () => {
  const [selectedCard, setSelectedCard] = useState('Card 1');
  const [cardDetails, setCardDetails] = useState({
    nameOnCard: "",
    cardNumber: "",
    expDate: "",
    cvv: "",
    nickname: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails({
      ...cardDetails,
      [name]: value,
    });
  };

  const handleSavePaymentMethod = async () => {
    const { nameOnCard, cardNumber, expDate, cvv, nickname } = cardDetails;

    if (!nameOnCard || !cardNumber || !expDate || !cvv) {
      alert("Please fill out all required fields.");
      return;
    }

    const paymentMethodRequest = {
      nameOnCard,
      cardNumber,
      expDate,
      cvv,
      nickname,
    };

    try {
      setLoading(true);
      const response = await PaymentService.savePaymentMethod(paymentMethodRequest);
      alert("Payment method saved successfully!");
      console.log("Saved payment method:", response);
      setCardDetails({
        nameOnCard: "",
        cardNumber: "",
        expDate: "",
        cvv: "",
        nickname: "",
      });
    } catch (error) {
      alert("Failed to save payment method.");
      console.error("Error saving payment method:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div>
        <h2 className="text-xl font-bold mb-4">Payment Methods</h2>

        {/* Card Selector */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between bg-gray-100 p-4 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="text-3xl mr-4">💳</div>
              <select
                  className="border border-gray-300 rounded px-4 py-2"
                  value={selectedCard}
                  onChange={(e) => setSelectedCard(e.target.value)}
              >
                <option value="Card 1">Card 1 - Name</option>
                <option value="Card 2">Card 2 - Name</option>
              </select>
            </div>
          </div>

          {/* Card Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-600">Name on the Card</label>
              <input
                  type="text"
                  name="nameOnCard"
                  value={cardDetails.nameOnCard}
                  onChange={handleInputChange}
                  className="border border-gray-300 p-2 rounded w-full"
                  placeholder="Cardholder Name"
              />
            </div>
            <div>
              <label className="block text-gray-600">Card Number</label>
              <input
                  type="text"
                  name="cardNumber"
                  value={cardDetails.cardNumber}
                  onChange={handleInputChange}
                  className="border border-gray-300 p-2 rounded w-full"
                  placeholder="1234 5678 9101 1121"
              />
            </div>
            <div>
              <label className="block text-gray-600">Exp. Date</label>
              <input
                  type="text"
                  name="expDate"
                  value={cardDetails.expDate}
                  onChange={handleInputChange}
                  className="border border-gray-300 p-2 rounded w-full"
                  placeholder="MM/YY"
              />
            </div>
            <div>
              <label className="block text-gray-600">CVV</label>
              <input
                  type="text"
                  name="cvv"
                  value={cardDetails.cvv}
                  onChange={handleInputChange}
                  className="border border-gray-300 p-2 rounded w-full"
                  placeholder="123"
              />
            </div>
            <div>
              <label className="block text-gray-600">Nickname (Optional)</label>
              <input
                  type="text"
                  name="nickname"
                  value={cardDetails.nickname}
                  onChange={handleInputChange}
                  className="border border-gray-300 p-2 rounded w-full"
                  placeholder="Card Nickname"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify">
            <button
                onClick={handleSavePaymentMethod}
                disabled={loading}
                className={`px-6 py-3 rounded-lg transition mt-4 ${
                    loading ? "bg-gray-400 cursor-not-allowed" : "bg-purple-500 text-white hover:bg-dark"
                }`}
            >
              {loading ? "Saving..." : "Save Payment Method"}
            </button>
          </div>
        </div>
      </div>
  );
};

export default Payment;
