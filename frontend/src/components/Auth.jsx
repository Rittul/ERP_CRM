import React, { useState } from "react";
import api from "../utils/api";
import "../css/Auth.css";
import { useNavigate } from "react-router-dom";
const Auth = ({ onClose }) => {
  const [email, setemailId] = useState("admin@example.com");
  const [password, setPassword] = useState("Password123");
  const [error, seterror] = useState("");
  const navigate = useNavigate();

  const handlelogin = async () => {
    try {
      const res = await api.post("/login", { email, password });
      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
      }
      alert("login Successfull!");
      navigate("/dashboard");
    } catch (err) {
      seterror(err.response?.data?.message || "Something went wrong");
      setTimeout(() => {
        seterror("");
      }, 3000);
    }
  };


  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth_main" onClick={(e) => e.stopPropagation()}>

        <h2 className="auth_title">Welcome back</h2>
            <p className="auth_subtitle">Log in to continue</p>

            <h3>Email id:</h3>
            <input
              type="text"
              value={email}
              onChange={(e) => setemailId(e.target.value)}
            />
            <h3>Password</h3>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="auth_submit" onClick={handlelogin}>Login</button>
            {error && <p className="auth_error">{error}</p>}
      </div>
    </div>
  );
};

export default Auth;