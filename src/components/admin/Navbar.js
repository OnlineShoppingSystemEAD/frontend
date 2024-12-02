import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faUser, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import NotificationDropdown from "./NotificationDropdown"; // Component for the notification dropdown
import adminService from "../../api/services/UserService"; // Service for logout functionality

const Navbar = () => {
  const notificationsData = [
    { message: "New Order Alert", date: "04/10" },
    { message: "Delivery Completed", date: "04/10" },
  ];

  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState(notificationsData);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    adminService.logout(); // Clear tokens from localStorage
    window.location.reload(); // Reload the page to update UI
  };

  const toggleNotificationDropdown = () => setNotificationOpen(!isNotificationOpen);

  const markAsRead = () => {
    setNotifications([]); // Clear notifications
    setNotificationOpen(false); // Close the dropdown
  };

  return (
    <div className="flex justify-between items-center px-5 py-4 bg-white border-b border-gray-300">
      {/* Navbar Left */}
      <div className="flex items-center">
        {/* Logo */}
        <div className="text-xl font-bold">SHOPZEN</div>
        {/* Navigation Links */}
        <nav className="ml-8 flex space-x-6">
          <a
            href="/orders"
            className="text-gray-700 hover:text-purple-500 font-medium text-sm"
          >
            Orders
          </a>
          <a
            href="/categories"
            className="text-gray-700 hover:text-purple-500 font-medium text-sm"
          >
            Categories
          </a>
        </nav>
      </div>

      {/* Navbar Right */}
      <div className="flex items-center space-x-4">
        {/* Notification Bell Icon */}
        <div className="relative">
          <FontAwesomeIcon
            icon={faBell}
            className="text-gray-700 text-base cursor-pointer hover:text-purple-500"
            onClick={toggleNotificationDropdown}
          />
          {notifications.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full px-2 text-xs">
              {notifications.length}
            </span>
          )}
          {isNotificationOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded-md shadow-lg z-50">
              <NotificationDropdown
                isOpen={isNotificationOpen}
                notifications={notifications}
                onMarkAsRead={markAsRead}
              />
            </div>
          )}
        </div>

        {/* Account Icon */}
        <Link to="/account">
          <FontAwesomeIcon
            icon={faUser}
            className={`text-base cursor-pointer ${
              isActive("/account") ? "text-purple-500" : "text-gray-700"
            } hover:text-purple-500`}
          />
        </Link>

        {/* Logout Icon */}
        <FontAwesomeIcon
          icon={faRightFromBracket}
          className="text-base text-gray-700 cursor-pointer hover:text-purple-500"
          onClick={handleLogout}
        />
      </div>
    </div>
  );
};

export default Navbar;
