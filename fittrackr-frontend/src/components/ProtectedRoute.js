import { Navigate } from "react-router-dom";
import { getToken } from "../authStorage";

function ProtectedRoute({ children }) {
  const token = getToken();

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise, show the protected page
  return children;
}

export default ProtectedRoute;
