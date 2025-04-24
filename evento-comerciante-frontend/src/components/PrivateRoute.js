import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const PrivateRoute = ({ element, roles = [] }) => {
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (!token) {
    return <Navigate to="/" />;
  }

  let role = null;
  try {
    const decoded = jwtDecode(token);
    role = decoded.role;
  } catch (error) {
    console.error("Token inválido:", error);
    return <Navigate to="/" />;
  }

  if (roles.length > 0 && !roles.includes(role)) {
    return location.pathname !== "/convite" ? <Navigate to="/convite" /> : null;
  }

  return element;
};

export default PrivateRoute;
