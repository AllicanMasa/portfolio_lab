import { useState } from "react";
import "./register.css";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleUsername = (e) => {
    setUsername(e.target.value);
    setSubmitted(false);
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
    setSubmitted(false);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
    setSubmitted(false);
  };

  const handleConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
    setSubmitted(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitted(false);

    // Frontend validation
    if (!username || !email || !password || !confirmPassword) {
      setError(["Please enter all the fields."]);
      return;
    }

    if (!/^[A-Za-z0-9._%+-]+@gmail\.com$/.test(email)) {
      setError(["Email must be a valid Gmail address."]);
      return;
    }

    if (password !== confirmPassword) {
      setError(["Passwords do not match."]);
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          password,
          confirm_password: confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle backend validation errors
        if (Array.isArray(data.detail)) {
          setError(data.detail.map((err) => err.msg));
        } else {
          setError([data.detail || "Registration failed."]);
        }
        return;
      }

      setSubmitted(true);
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(["Unable to register right now. Please try again."]);
    }
  };

  // Render error messages
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

  // Render success message
  const successMessage = () => {
    if (!submitted) return null;

    return (
      <div className="success">
        <h1>User {username || " "} successfully registered!!</h1>
      </div>
    );
  };

  return (
    <div className="form">
      <div>
        <h1>User Registration</h1>
      </div>

      <div className="messages">
        {errorMessage()}
        {successMessage()}
      </div>

      <form onSubmit={handleSubmit}>
        <label className="label">Username</label>
        <input
          className="input"
          type="text"
          value={username}
          onChange={handleUsername}
          autoComplete="username"
        />

        <label className="label">Email</label>
        <input
          className="input"
          type="email"
          value={email}
          onChange={handleEmail}
          autoComplete="email"
        />

        <label className="label">Password</label>
        <input
          className="input"
          type="password"
          value={password}
          onChange={handlePassword}
          autoComplete="new-password"
        />

        <label className="label">Confirm Password</label>
        <input
          className="input"
          type="password"
          value={confirmPassword}
          onChange={handleConfirmPassword}
          autoComplete="new-password"
        />

        <button className="btn" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}