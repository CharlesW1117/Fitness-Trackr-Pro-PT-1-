import { useState } from "react";
import "./Login.css";

function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    const res = await fetch("http://localhost:3000/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || "Login failed.");
      return;
    }

    // ⭐ Remember Me logic
    if (rememberMe) {
      localStorage.setItem("token", data.token);
    } else {
      sessionStorage.setItem("token", data.token);
    }

    window.location.href = "/dashboard";
  };

  return (
    <div className="login-container">
      <h2>Login</h2>

      <input
        className="input-field"
        placeholder="Username"
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
      />

      <input
        className="input-field"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      {/* ⭐ Remember Me checkbox */}
      <label className="remember-me">
        <input
          type="checkbox"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
        />
        Remember Me
      </label>

      <button onClick={handleLogin} className="btn btn-blue">
        Login
      </button>

      {message && <p className="login-message">{message}</p>}
    </div>
  );
}

export default Login;
