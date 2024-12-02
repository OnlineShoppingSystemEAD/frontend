// NotificationDropdown.js
import React from 'react';
import '../../styles/notificationDropdown.css'; // CSS file for styling the dropdown

const NotificationDropdown = ({ isOpen, notifications, onMarkAsRead }) => {
    if (!isOpen) return null;

    return (
        <div className="notification-dropdown">
            {notifications.length === 0 ? (
                <div className="notification-item no-notifications">No new notifications</div>
            ) : (
                notifications.map((notification, index) => (
                    <div className="notification-item" key={index}>
                        <span>{notification.message}</span>
                        <span className="notification-date">{notification.date}</span>
                    </div>
                ))
            )}
            <button className="mark-as-read-button" onClick={onMarkAsRead}>
                Mark as read
            </button>
        </div>
    );
};

export default NotificationDropdown;
