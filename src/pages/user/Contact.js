import React from "react";
import Header from "../../components/user/Header";
import Footer from "../../components/user/Footer";
import ContactSection from "../../components/user/Contact/ContactSection";

const Contact = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
