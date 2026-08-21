import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, loginUser } from "../api";
import { saveToken } from "../authStorage";
import "./register.css";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setIsError(true);
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const data = await registerUser(username, password);
      setIsError(false);
      setMessage(data.message || "User registered successfully");

      // Log the new user in so the protected dashboard can load, then take
      // them straight to their dashboard after they've seen the confirmation.
      const loginData = await loginUser(username, password);
      saveToken(loginData.token, false);
      setTimeout(() => navigate("/dashboard"), 1800);
    } catch (error) {
      setIsError(true);
      setMessage(error.message || "Registration failed.");
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>

      <form onSubmit={handleSubmit}>
        <input
          className="input-field"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="input-field"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          className="input-field"
          placeholder="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button type="submit" className="btn btn-green">
          Register
        </button>
      </form>

      {message && (
        <p className={isError ? "register-error" : "register-message"}>
          {message}
        </p>
      )}
    </div>
  );
}

export default Register;
