import React from 'react';

const Ongoing = () => {
  const ongoingOrders = [
    {
      id: 1,
      productDescription: 'Product Description 1',
      billingAddress: 'Billing Address 1',
      totalPrice: 'USD 75',
      status: 'Packing',
    },
    {
      id: 2,
      productDescription: 'Product Description 2',
      billingAddress: 'Billing Address 2',
      totalPrice: 'USD 20',
      status: 'Checkout',
    },
    {
      id: 3,
      productDescription: 'Product Description 3',
      billingAddress: 'Billing Address 3',
      totalPrice: 'USD 40',
      status: 'In Delivery',
    },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Ongoing Orders</h2>

      {/* Table Headings */}
      <div className="grid grid-cols-5 text-sm font-semibold text-gray-600 mb-2">
        <div>Product</div>
        <div>Description</div>
        <div>Billing Address</div>
        <div>Total Price</div>
        <div>Status</div>
      </div>

      {/* Divider */}
      <hr className="border-gray-300 mb-4" />

      {/* Orders */}
      {ongoingOrders.map((order) => (
        <div
          key={order.id}
          className="grid grid-cols-5 items-center bg-gray-100 p-4 mb-4 rounded-lg shadow-md"
        >
          {/* Product Image Placeholder */}
          <div className="text-3xl">🖼️</div>

          {/* Product Description */}
          <div>
            <h3 className="font-semibold">{order.productDescription}</h3>
            <p className="text-sm text-gray-500">.................................</p>
          </div>

          {/* Billing Address */}
          <div>
            <p>{order.billingAddress}</p>
            <p className="text-sm text-gray-500">.................................</p>
          </div>

          {/* Total Price */}
          <div>{order.totalPrice}</div>

          {/* Status */}
          <div>{order.status}</div>
        </div>
      ))}
    </div>
  );
};

export default Ongoing;
