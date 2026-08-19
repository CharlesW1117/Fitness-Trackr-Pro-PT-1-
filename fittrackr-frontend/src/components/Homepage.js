import { Link } from "react-router-dom";
import "./Homepage.css";

function HomePage() {
  return (
    <div className="home-container">
      <h1 className="home-title">Fitness Trackr Pro</h1>
      <p className="home-subtitle">
        Track your goals. Log your progress. Crush your limits.
      </p>

      <div className="home-buttons">
        <Link to="/register" className="btn btn-green">
          Create Account
        </Link>
        <Link to="/login" className="btn btn-blue">
          Login
        </Link>
      </div>

      <div className="home-features">
        <h2>Features</h2>
        <ul>
          <li>Set fitness goals with target values</li>
          <li>Log progress daily or weekly</li>
          <li>Visual charts to track improvement</li>
          <li>Motivational toast messages</li>
          <li>Clean neon fitness UI</li>
        </ul>
      </div>
    </div>
  );
}

export default HomePage;
