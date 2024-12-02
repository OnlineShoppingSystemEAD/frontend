import React from 'react';
import Header from '../../components/user/Header';
import Footer from '../../components/user/Footer';
import ProductOverview from "../../components/user/Shop/ProductOverview";

const About = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
                <ProductOverview />
            </main>
            <Footer />
        </div>
    );
};

export default About;
