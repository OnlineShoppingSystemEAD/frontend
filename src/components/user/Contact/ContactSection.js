import React, { useState } from "react";
import Trends from "../../../assets/Trends.png";
import { MdLocationPin, MdLocalPhone, MdLocalPostOffice } from "react-icons/md";

const ContactSection = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can add form submission logic here, like sending the data to an API.
    console.log("Email:", email);
    console.log("Message:", message);
    // Reset the form fields after submission if needed
    setEmail("");
    setMessage("");
  };

  return (
    <>
      <section
        className="relative pt-64 text-center bg-center"
        style={{ backgroundImage: `url(${Trends})` }}
      >
        <h2 className="absolute inset-0 flex items-center justify-center text-6xl font-bold text-white">
          Contact Us
        </h2>
      </section>
      <div className="bg-transparent pt-[60px] pb-[60px">
        <div className="flex justify-between m-20 border h-[500px] border-slate-300">
          {/* Left Form Div */}
          <div className="w-[44%] rounded-[10px] m-2 bg-gray-100 text-center">
            <form onSubmit={handleSubmit} className="p-3 mt-2 ml-10 mr-10">
              <div className="mt-5 mb-8">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 text-[120%]"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                  placeholder="Enter your email"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 text-[120%]"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows="4"
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                  placeholder="Type your message here"
                />
              </div>
              <button
                type="submit"
                className="text-[120%] w-full py-2 text-white transition duration-200 bg-blue-600 rounded-xl hover:bg-blue-700"
              >
                Submit
              </button>
            </form>
          </div>

          {/* Right Contact Div */}
          <div className="w-[44%] rounded-[10px] flex flex-col justify-center items-center m-2 px-[40px] bg-gray-100 text-center">
            <div className="flex items-center justify-center mt-0">
              <MdLocationPin className="ml-0 mr-2 text-2xl text-black" />
              <h3 className="mt-0 text-2xl">Address</h3>
            </div>
            <p className="text-[125%] text-gray-600">
              123 Main St, City, Country
            </p>

            <div className="flex items-center justify-center mt-14">
              <MdLocalPhone className="mr-2 text-2xl text-black" />
              <h3 className="mt-0 text-2xl">Let's Talk</h3>
            </div>
            <p className="text-[125%] text-gray-600">+1 800 1236879</p>

            <div className="flex items-center justify-center mt-14">
              <MdLocalPostOffice className="mr-2 text-2xl text-black" />
              <h3 className="mt-0 text-2xl">Sales Support</h3>
            </div>
            <p className="text-[125%] text-gray-600">contact@example.com</p>
          </div>
        </div>
      </div>

      <section>
        <div className="">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.8863832594116!2d79.89959157473392!3d6.799992019889106!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae24546a17bdcf5%3A0x15a1b1f9024e8fb9!2sKatubedda%2C%20Moratuwa!5e1!3m2!1sen!2slk!4v1729427043987!5m2!1sen!2slk"
            className="w-full h-[450px] border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </>
  );
};

export default ContactSection;
