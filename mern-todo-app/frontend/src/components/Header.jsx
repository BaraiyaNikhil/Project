import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Notifications from "./Notifications";
import "./Header.css";

const Header = ({ token, setToken }) => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const [showNotifs, setShowNotifs] = useState(false);

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const toggleNotifications = () => {
    setShowNotifs(prev => !prev);
  };

  return (
    <header className="header">
      <div className="header-left">
        {token && username ? (
          <span className="header-greeting">Hello, {username}!</span>
        ) : (
          <Link to="/todos" className="header-logo">TodoApp</Link>
        )}
      </div>
      <div className="header-right">
        {token ? (
          <>
            <Link to="/todos" className="header-link">Todos</Link>
            <button className="notif-btn" onClick={toggleNotifications}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 01-3.46 0" />
              </svg>
            </button>
            <button className="header-button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="header-link">Login</Link>
            <Link to="/register" className="header-link">Register</Link>
          </>
        )}
      </div>
      {showNotifs && token && (
        <Notifications 
          userId={localStorage.getItem("userId")}
          closePopup={() => setShowNotifs(false)}
        />
      )}
    </header>
  );
};

export default Header;
