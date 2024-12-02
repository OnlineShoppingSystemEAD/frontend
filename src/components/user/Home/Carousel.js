import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import rightArrow from '../../../assets/right-arrow.png';
import leftArrow from '../../../assets/left-arrow.png';

const Carousel = ({ images, isModal }) => {
    const [nav1, setNav1] = useState(null);
    const [nav2, setNav2] = useState(null);
    const navigate = useNavigate(); // Hook for navigation

    const NextArrow = ({ onClick }) => (
        <div
            className="absolute top-1/2 right-5 z-10 cursor-pointer transform -translate-y-1/2 w-12 h-12 bg-black/50 flex items-center justify-center rounded-full"
            onClick={onClick}
        >
            <img src={rightArrow} alt="Next" className="w-full h-auto" />
        </div>
    );

    const PrevArrow = ({ onClick }) => (
        <div
            className="absolute top-1/2 left-5 z-10 cursor-pointer transform -translate-y-1/2 w-12 h-12 bg-black/50 flex items-center justify-center rounded-full"
            onClick={onClick}
        >
            <img src={leftArrow} alt="Previous" className="w-full h-auto" />
        </div>
    );

    const settingsMain = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        fade: true,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        asNavFor: nav2,
    };

    return (
        <Slider {...settingsMain} asNavFor={nav2} ref={(slider1) => setNav1(slider1)}>
            {images.map((image, index) => (
                <div key={index} className="relative">
                    <img src={image.src} alt={`Slide ${index + 1}`} className="w-full h-screen object-cover" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">{image.mainText}</h1>
                        <p className="text-lg md:text-xl mb-6">{image.subText}</p>
                        {/* Hide the Quick View button if `isModal` is true */}
                        {!isModal && (
                            <button
                                onClick={() => navigate('/shop')} // Dynamic button navigation
                                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-dark transition"
                            >
                                {image.buttonText}
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </Slider>
    );
};

export default Carousel;
