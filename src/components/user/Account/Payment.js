import React, { useState } from 'react';

const Payment = () => {
  const [selectedCard, setSelectedCard] = useState('Card 1');

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Payment Methods</h2>

      {/* Card Selector */}
      <div className="space-y-6">
        {/* Card 1 */}
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
              className="border border-gray-300 p-2 rounded w-full"
              placeholder="Cardholder Name"
            />
          </div>
          <div>
            <label className="block text-gray-600">Card Number</label>
            <input
              type="text"
              className="border border-gray-300 p-2 rounded w-full"
              placeholder="1234 5678 9101 1121"
            />
          </div>
          <div>
            <label className="block text-gray-600">Exp. Date</label>
            <input
              type="text"
              className="border border-gray-300 p-2 rounded w-full"
              placeholder="MM/YY"
            />
          </div>
          <div>
            <label className="block text-gray-600">CVV</label>
            <input
              type="text"
              className="border border-gray-300 p-2 rounded w-full"
              placeholder="123"
            />
          </div>
          <div>
            <label className="block text-gray-600">Nickname (Optional)</label>
            <input
              type="text"
              className="border border-gray-300 p-2 rounded w-full"
              placeholder="Card Nickname"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-dark transition mt-4">Done</button>
        </div>
      </div>

      {/* Add New Payment Method */}
      <div className="mt-8 flex justify-center">
        <button className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-dark transition">
          <span className="mr-2">+</span> Add Payment Method
        </button>
      </div>
    </div>
  );
};

export default Payment;
