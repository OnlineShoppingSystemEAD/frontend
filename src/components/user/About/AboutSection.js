import React from 'react';

const AboutSection = () => {
  return (
    <section className="pt-0 mb-16">
      {/* Background image with overlayed text */}
      <div
        className="relative h-72 bg-cover bg-center -mt-12"
        style={{ backgroundImage: 'url(https://themewagon.github.io/cozastore/images/about-01.jpg)' }}
      >
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="relative z-10 flex items-center justify-center h-full">
          <h1 className="text-5xl font-bold text-white">About</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-12">
        {/* Our Story Section */}
        <h2 className="text-3xl font-bold mb-6">Our Story</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <p className="text-gray-600 leading-relaxed">
              At ShopZen, our journey began with a simple idea: to create a stress-free and joyful online shopping experience for everyone. Founded with a passion for convenience and quality, we wanted to build a platform where customers could find everything they need in one place, from everyday essentials to the latest trends.

              We believe that shopping should be a delightful experience—one that fits seamlessly into your busy life. With a focus on providing high-quality products, exceptional customer service, and a user-friendly shopping experience, ShopZen has grown into a trusted name in the online shopping world. Our customers are at the heart of everything we do, and we are committed to continually evolving and expanding our offerings to meet their needs.

              Join us on this journey to redefine online shopping—where simplicity, convenience, and happiness are just a click away.
            </p>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative group">
              <div className="absolute -inset-2 border-2 border-gray-300 rounded-lg pointer-events-none"></div>
              <img
                src="https://themewagon.github.io/cozastore/images/about-01.jpg"
                alt="Story"
                className="w-full max-w-xs h-auto object-cover rounded-lg shadow-lg transition-transform duration-300 ease-in-out group-hover:scale-105"
              />
            </div>
          </div>
        </div>

        {/* Our Mission Section */}
        <div className="mt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="flex items-center justify-center">
              <div className="relative group">
                <div className="absolute -inset-2 border-2 border-gray-300 rounded-lg pointer-events-none"></div>
                <img
                  src="https://themewagon.github.io/cozastore/images/about-02.jpg"
                  alt="Mission"
                  className="w-full max-w-xs h-auto object-cover rounded-lg shadow-lg transition-transform duration-300 ease-in-out group-hover:scale-105"
                />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed">
                At ShopZen, our mission is to bring ease, value, and joy to online shopping by providing a wide range of quality products, a seamless shopping experience, and outstanding customer service. We aim to empower our customers with the best shopping experience, ensuring that each interaction leaves a smile and a sense of fulfillment.
              </p>
              <blockquote className="mt-8 italic text-gray-600 border-l-4 border-gray-400 pl-4">
                "Creativity is just connecting things. When you ask creative people how they did something, they feel a little guilty
                because they didn't really do it, they just saw something. It seemed obvious to them after a while."
                <br />
                <span className="font-bold">- Steve Jobs</span>
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
