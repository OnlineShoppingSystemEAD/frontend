import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import adminService from "../../api/services/UserService"; // Service for logout functionality

// Confirmation Modal Component
const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null; // Don't render the modal if not open

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h3 className="text-lg font-bold mb-4 text-gray-700">Are you sure you want to log out?</h3>
        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-purple-500"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-black"
            onClick={onConfirm}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // Fixed variable name
  const location = useLocation();

  const isActive = (path) => location.pathname === path; // Function to check if the link is active

  const handleLogout = () => {
    setIsModalOpen(true); // Open the modal when logout is clicked
  };

  const confirmLogout = () => {
    adminService.logout(); // Clear tokens from localStorage
    window.location.reload(); // Reload the page to update UI
    setIsModalOpen(false); // Close the modal
  };

  const cancelLogout = () => {
    setIsModalOpen(false); // Just close the modal if the user cancels
  };

  return (
    <div className="flex justify-between items-center px-5 py-4 bg-white border-b border-gray-300">
      {/* Navbar Left */}
      <div className="flex items-center">
        {/* Logo */}
        <div className="text-xl font-bold">SHOPZEN</div>
        {/* Navigation Links */}
        <nav className="ml-8 flex space-x-6">
          <Link
            to="/orders"
            className={`${
              isActive("/orders") ? "text-purple-500" : "text-gray-700"
            } hover:text-purple-500 font-medium text-sm`}
          >
            Orders
          </Link>
          <Link
            to="/categories"
            className={`${
              isActive("/categories") ? "text-purple-500" : "text-gray-700"
            } hover:text-purple-500 font-medium text-sm`}
          >
            Categories
          </Link>
        </nav>
      </div>

      {/* Navbar Right */}
      <div className="flex items-center space-x-4">
        {/* Logout Icon */}
        <FontAwesomeIcon
          icon={faRightFromBracket}
          className="text-base text-gray-700 cursor-pointer hover:text-purple-500"
          onClick={handleLogout}
        />
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={cancelLogout}
        onConfirm={confirmLogout}
      />
    </div>
  );
};

export default Navbar;
