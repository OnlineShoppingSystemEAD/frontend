import React from "react";
import Header from "../../components/user/Header";
import Footer from "../../components/user/Footer";
import CartSection from "../../components/user/Cart/CartSection";

const Cart = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <CartSection />
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
