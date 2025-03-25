import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import TodoList from "./components/TodoList";
import Header from "./components/Header";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  
  return (
    <div>
      <Header token={token} setToken={setToken} />
      <Routes>
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:userId" element={<ResetPassword />} />
        <Route path="/todos" element={token ? <TodoList /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to={token ? "/todos" : "/login"} />} />
      </Routes>
    </div>
  );
}

export default App;
