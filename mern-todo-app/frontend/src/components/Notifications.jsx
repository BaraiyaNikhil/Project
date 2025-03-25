import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Notifications.css";

const Notifications = ({ userId, closePopup }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (userId) {
      fetchNotifications();
    }
  }, [userId]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/notifications/${userId}`);
      setNotifications(res.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:3000/api/notifications/${id}/markAsRead`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  return (
    <div className="notifications-popup">
      <div className="notif-header">
        <h3>Notifications</h3>
        <button onClick={closePopup} className="close-popup">✖</button>
      </div>
      <div className="notif-content">
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <div
              key={notif._id}
              className={`notification-item ${notif.isRead ? "read" : "unread"}`}
            >
              <p>{notif.message}</p>
              {!notif.isRead && (
                <button onClick={() => markAsRead(notif._id)}>Mark as Read</button>
              )}
            </div>
          ))
        ) : (
          <p>No new notifications</p>
        )}
      </div>
    </div>
  );
};

export default Notifications;
