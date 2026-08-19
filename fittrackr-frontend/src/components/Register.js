import { useState } from "react";
import { registerUser } from "../api";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const data = await registerUser(username, password);
      setMessage(data.message || "User registered successfully");
    } catch (error) {
      setMessage(error.message || "Registration failed.");
    }
  };

  return (
    <div style={{ maxWidth: "300px", margin: "20px auto" }}>
      <h2>Register</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ display: "block", marginBottom: "10px", width: "100%" }}
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ display: "block", marginBottom: "10px", width: "100%" }}
        />

        <input
          placeholder="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={{ display: "block", marginBottom: "10px", width: "100%" }}
        />

        <button type="submit" style={{ width: "100%" }}>
          Register
        </button>
      </form>

      {message && <p style={{ marginTop: "15px", color: "red" }}>{message}</p>}
    </div>
  );
}

export default Register;
