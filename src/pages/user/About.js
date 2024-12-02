import React from 'react';
import Header from '../../components/user/Header';
import Footer from '../../components/user/Footer';
import AboutSection from '../../components/user/About/AboutSection';

const About = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
                <AboutSection />
            </main>
            <Footer />
        </div>
    );
};


export default About;
