import { useState } from "react";
import "./register.css";
import { Link } from 'react-router-dom'
import { PiConfettiBold } from "react-icons/pi";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState(null);
  const [modalConfig, setModalConfig] = useState(null);

  const { username, fullname, email, password, confirmPassword } = formData;

  const passwordsMatch =
    password && confirmPassword && password === confirmPassword;

  const isFormValid =
    username.trim() &&
    fullname.trim() &&
    email.trim() &&
    password &&
    confirmPassword &&
    /^[A-Za-z0-9._%+-]+@gmail\.com$/.test(email) &&
    passwordsMatch;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("http://localhost:8000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          fullname,
          email,
          password,
          confirm_password: confirmPassword,
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonErr) {
        console.error("Failed to parse JSON:", jsonErr);
        data = { detail: "Invalid response from server" };
      }

      if (!response.ok) {
        // Show field/validation errors as list
        if (Array.isArray(data.detail)) {
          setError(data.detail.map((err) => err.msg || String(err)));
        } else {
          setError([data.detail || "Registration failed"]);
        }

        // Duplicate email modal
        if (
          response.status === 409 ||
          (typeof data.detail === "string" &&
            data.detail.toLowerCase().includes("email") &&
            data.detail.toLowerCase().includes("already")) ||
          (typeof data.detail === "string" &&
            data.detail
              .toLowerCase()
              .includes("this email is already registered"))
        ) {
          setModalConfig({
            type: "error",
            title: "Email Already Registered",
            message:
              "This email is already in use. Would you like to log in instead?",
            primaryAction: {
              label: "Go to Login",
              to: "/login",
              // className: "login-link",
            },
            secondaryAction: {
              label: "Try Another Email",
              onClick: () => setModalConfig(null),
            },
          });
          return;
        }

        return;
      }

      // ── Success ─────────────────────────────────────────────
      setModalConfig({
        type: "success",
        title: "🎉 Account Created!",
        message: "Your account has been successfully registered.",
        primaryAction: {
          label: "Go to Login",
          to: "/login",
          // className: "login-link",
        },
        secondaryAction: {
          label: "Close",
          onClick: () => setModalConfig(null),
        },
      });

      // Reset form only on success
      setFormData({
        username: "",
        fullname: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(["Unable to register right now. Please try again."]);
    }
  };

  const errorMessage = () => {
    if (!error) return null;
    return (
      <div className="error">
        {error.map((errMsg, index) => (
          <p key={index}>{errMsg}</p>
        ))}
      </div>
    );
  };

  return (
    <div className="form">
      <title>Create Account</title>
      <section className="register">
        <div className="title">
          <p className="ico"><PiConfettiBold /></p>
          <h1>Create a new account.</h1>
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>

        <div className="register-input">
          <form onSubmit={handleSubmit} className="register-form">
            <input
              className="input1"
              type="text"
              name="username"
              placeholder="Username"
              value={username}
              onChange={handleChange}
              autoComplete="username"
            />
            <input
              className="input2"
              type="text"
              name="fullname"
              placeholder="Fullname"
              value={fullname}
              onChange={handleChange}
              autoComplete="name"
            />
            <input
              className="input3"
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={handleChange}
              autoComplete="email"
            />
            <input
              className="input4"
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={handleChange}
              autoComplete="new-password"
            />
            <input
              className={`input5 ${confirmPassword.length === 0 ? "" : passwordsMatch ? "match" : "no-match"}`}
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
            />

            <button className="btn" type="submit" disabled={!isFormValid}>
              Get Started
            </button>
          </form>
        </div>
      </section>

      <section className="register-img">
        <img src="../assets/register-bg.png" alt="Register background" />
      </section>

      {modalConfig && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{modalConfig.title}</h2>
            <p>{modalConfig.message}</p>

            <div className="modal-actions">
              {modalConfig.primaryAction.to ? (
                <Link
                  to={modalConfig.primaryAction.to}
                  className={modalConfig.primaryAction.className || "btn"}
                >
                  {modalConfig.primaryAction.label}
                </Link>
              ) : (
                <button
                  className="btn"
                  onClick={modalConfig.primaryAction.onClick}
                >
                  {modalConfig.primaryAction.label}
                </button>
              )}

              {modalConfig.secondaryAction && (
                <button
                  className="close-btn"
                  onClick={modalConfig.secondaryAction.onClick}
                >
                  {modalConfig.secondaryAction.label}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
