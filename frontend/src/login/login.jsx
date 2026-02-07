import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiFillExperiment } from "react-icons/ai";
import "./login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "Login failed");
        return;
      }

      // Save JWT token
      localStorage.setItem("token", data.access_token);

      // Redirect to landing/dashboard page
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError("Server error");
    }
  };

  return (
    <div className="login-container">
      <title>Portfolio Lab</title>

      <section className="login-header">
        <p><AiFillExperiment /></p>
        <h1>PORTFOLIO LAB</h1>
      </section>

      <section className="login">
        <div className="login-image">
        <img className="image" src="../assets/login-image.png" alt="Register background" />
        </div>

        <div className="login-form">
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            className="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="login-button" type="submit">Login</button>
        </form>

        <p>
          Don't have an account? <a href="/register">Register</a>
        </p>
        </div>
      </section>

    </div>
  );
}
