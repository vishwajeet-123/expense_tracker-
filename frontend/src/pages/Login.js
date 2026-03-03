import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await API.post("/auth/login", form);

    localStorage.setItem("token", res.data.token);
    navigate("/dashboard");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Email"
        onChange={(e) => setForm({...form, email: e.target.value})} />
      <input type="password" placeholder="Password"
        onChange={(e) => setForm({...form, password: e.target.value})} />
      <button>Login</button>
      <p>
  Don't have an account? <a href="/register">Register</a>
</p>
    </form>
  );
}

export default Login;