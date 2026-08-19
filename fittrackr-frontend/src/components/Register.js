import { useState } from "react";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:3000/api/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, confirmPassword }),
    });

    const data = await response.json();
    setMessage(data.error || data.message);
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
