import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./ResetPassword.css";

const ResetPassword = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    try {
      const res = await axios.post(`http://localhost:3000/api/auth/reset-password/${userId}`, { newPassword });
      setMessage(res.data.message);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setMessage("Error updating password");
      console.error("Reset password error:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Reset Password</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input 
          type="password" 
          placeholder="New Password" 
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required 
        />
        <input 
          type="password" 
          placeholder="Confirm New Password" 
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required 
        />
        <button type="submit">Update Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
