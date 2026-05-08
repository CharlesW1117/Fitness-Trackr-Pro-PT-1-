import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import Error404 from "./Error404.jsx";
import App from "./App.jsx";
import Register from "./auth/Register";
import Login from "./auth/Login";
import ActivitiesPage from "./activities/ActivitiesPage";
import { AuthProvider } from "./auth/AuthContext";
import { PageProvider } from "./layout/PageContext";
import Layout from "./layout/Layout.jsx";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <PageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<App />} />
            <Route path="register" element={<Register />} />
            <Route path="login" element={<Login />} />
            <Route path="activities" element={<ActivitiesPage />} />
            <Route path="*" element={<Error404 />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </PageProvider>
  </AuthProvider>,
);
