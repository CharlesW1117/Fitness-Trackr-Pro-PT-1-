import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api";
import { saveToken } from "../authStorage";
import "./Login.css";

function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const data = await loginUser(form.username, form.password);
      saveToken(data.token, rememberMe);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setMessage(error.message || "Network error: Could not connect to the server.");
    }
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
