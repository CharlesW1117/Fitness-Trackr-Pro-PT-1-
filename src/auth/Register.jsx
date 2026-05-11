import { useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

/** A form that allows users to register for a new account */
export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  async function tryRegister(event) {
    event.preventDefault(); // stop default form submission
    setError(null);

    const formData = new FormData(event.target);
    const username = formData.get("username");
    const password = formData.get("password");

    try {
      await register({ username, password });
      navigate("/activities");
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <>
      <h1>Register for an account</h1>
      <form onSubmit={tryRegister}>
        <label>
          Username
          <input type="text" name="username" required />
        </label>
        <label>
          Password
          <input type="password" name="password" required />
        </label>
        <button type="submit">Register</button>
        {error && <p role="alert">{error}</p>}
      </form>
      <a onClick={() => navigate("/login")}>
        Already have an account? Log in here.
      </a>
    </>
  );
}
