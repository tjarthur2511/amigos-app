// src/components/PublicRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const PublicRoute = ({ children }) => {
  const { currentUser } = useAuth();

  return !currentUser ? children : <Navigate to="/" />;
};

export default PublicRoute;
