import React from 'react';
import Header from '../../components/user/Header';
import Footer from '../../components/user/Footer';
import TileGrid from "../../components/user/Home/TileGrid";
import ProductOverview from "../../components/user/Shop/ProductOverview";
import Carousel from "../../components/user/Home/Carousel";

const Home = () => {
    const carouselImages = [
        {
            src: "https://images.pexels.com/photos/432059/pexels-photo-432059.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            mainText: "Discover New Fashion Trends",
            subText: "Experience the Latest Styles Today",
            buttonText: "Shop Now",
        },
        {
            src: "https://images.pexels.com/photos/247204/pexels-photo-247204.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            mainText: "Exclusive Collection Launch",
            subText: "Join Us for the Latest Arrivals",
            buttonText: "Explore More",
        },
        {
            src: "https://images.pexels.com/photos/1182825/pexels-photo-1182825.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            mainText: "Shop the Latest Styles",
            subText: "Discover New Fashion Trends",
            buttonText: "Shop Now",
        },
    ];

    return (
        <div className="flex flex-col min-h-screen">
            <Header/>
            <main className="flex-grow">
                <Carousel images={carouselImages}/> {/* Pass the image array here */}
                <TileGrid/>
                <ProductOverview/>
            </main>
            <Footer/>
        </div>
    );
};

export default Home;
