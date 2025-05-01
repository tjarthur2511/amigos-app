// src/components/PublicRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const PublicRoute = ({ children }) => {
  const { currentUser } = useAuth();

  // ✅ If no user is logged in, render the child component (like login/signup)
  // ❌ If already logged in, redirect them to homepage
  return !currentUser ? children : <Navigate to="/" />;
};

export default PublicRoute;
