import React, { useState } from 'react';

const Carousel = ({ images, isModalOpen }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
      <div
          className={`relative w-full max-w-5xl mx-auto overflow-hidden rounded-lg shadow-lg bg-white ${
              isModalOpen ? 'modal-carousel' : ''
          }`}
          style={{ maxHeight: '90vh' }} // Ensure the modal doesn't exceed the viewport height
      >
        {/* Carousel Images */}
        <div
            className="flex transition-transform duration-500"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((image, index) => (
              <img
                  key={index}
                  src={image}
                  alt={`Slide ${index}`}
                  className="w-full h-[500px] object-cover" // Adjusted image height
              />
          ))}
        </div>

        {/* Left Arrow */}
        <button
            onClick={prevSlide}
            className="absolute top-1/2 left-4 -translate-y-1/2 flex items-center justify-center bg-gray-800 text-white h-12 w-12 rounded-full hover:bg-gray-700 focus:outline-none"
        >
          &#8249;
        </button>

        {/* Right Arrow */}
        <button
            onClick={nextSlide}
            className="absolute top-1/2 right-4 -translate-y-1/2 flex items-center justify-center bg-gray-800 text-white h-12 w-12 rounded-full hover:bg-gray-700 focus:outline-none"
        >
          &#8250;
        </button>
      </div>
  );
};

export default Carousel;
