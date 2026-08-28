import { NavLink, useNavigate } from "react-router-dom";
import { clearToken } from "../authStorage";
import "./NavBar.css";

function NavBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearToken();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <span className="navbar-brand">Fitness Trackr Pro</span>

      <div className="navbar-links">
        <NavLink to="/dashboard" className="navbar-link">
          Dashboard
        </NavLink>
        <NavLink to="/water" className="navbar-link">
          Water
        </NavLink>
        <NavLink to="/measurements" className="navbar-link">
          Measurements
        </NavLink>
      </div>

      <button onClick={handleLogout} className="btn btn-red navbar-logout">
        Logout
      </button>
    </nav>
  );
}

export default NavBar;
