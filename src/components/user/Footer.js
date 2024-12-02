import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faPinterest } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 py-10">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-6">
                {/* Categories */}
                <div>
                    <h3 className="text-white font-bold mb-4">CATEGORIES</h3>
                    <ul className="space-y-2">
                        <li>Women</li>
                        <li>Men</li>
                        <li>Shoes</li>
                        <li>Watches</li>
                    </ul>
                </div>

                {/* Help */}
                <div>
                    <h3 className="text-white font-bold mb-4">HELP</h3>
                    <ul className="space-y-2">
                        <li>Track Order</li>
                        <li>Returns</li>
                        <li>Shipping</li>
                        <li>FAQs</li>
                    </ul>
                </div>

                {/* Get in Touch */}
                <div>
                    <h3 className="text-white font-bold mb-4">GET IN TOUCH</h3>
                    <p className="mb-4">
                        Any questions? Let us know in store at 8th floor, 379 Hudson St, New York, NY 10018 or call us on (+1) 96 716 6879
                    </p>
                    <div className="flex space-x-4">
                        <FontAwesomeIcon icon={faFacebook} className="hover:text-white cursor-pointer" />
                        <FontAwesomeIcon icon={faInstagram} className="hover:text-white cursor-pointer" />
                        <FontAwesomeIcon icon={faPinterest} className="hover:text-white cursor-pointer" />
                    </div>
                </div>

                {/* Newsletter */}
                <div>
                    <h3 className="text-white font-bold mb-4">NEWSLETTER</h3>
                    <form>
                        <input
                            type="email"
                            placeholder="email@example.com"
                            className="w-full p-2 mb-4 rounded text-gray-900"
                        />
<button className="bg-purple-500 text-white font:bold px-4 py-2 rounded w-full hover:bg-white hover:text-purple-500 hover: transition-colors duration-300">
    SUBSCRIBE
</button>


                    </form>
                </div>
            </div>
            
            {/* Payment Methods */}
            <div className="container mx-auto mt-8 px-6">
                <div className="flex justify-center space-x-4 mb-4">
                    <img src="https://themewagon.github.io/cozastore/images/icons/icon-pay-01.png" alt="PayPal" />
                    <img src="https://themewagon.github.io/cozastore/images/icons/icon-pay-02.png" alt="Visa" />
                    <img src="https://themewagon.github.io/cozastore/images/icons/icon-pay-03.png" alt="MasterCard" />
                    <img src="https://themewagon.github.io/cozastore/images/icons/icon-pay-04.png" alt="American Express" />
                    <img src="https://themewagon.github.io/cozastore/images/icons/icon-pay-05.png" alt="Discover" />
                </div>
                <p className="text-center text-gray-500 text-sm">
                    Copyright ©2024 All rights reserved
                </p>
            </div>
        </footer>
    );
};

export default Footer;
