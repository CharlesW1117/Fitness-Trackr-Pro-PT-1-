import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import HomePage from "./components/Homepage";
import NavBar from "./components/NavBar";
import WaterTracker from "./components/WaterTracker";
import BodyMeasurements from "./components/BodyMeasurements";
import { getToken } from "./authStorage";

// Guards the authenticated area and renders the shared navigation above
// each protected page.
function ProtectedLayout() {
  if (!getToken()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected area with shared navigation */}
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/water" element={<WaterTracker />} />
          <Route path="/measurements" element={<BodyMeasurements />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
