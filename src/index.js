// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "./i18n"; // i18n internationalization setup
import { AuthProvider } from "./context/AuthContext"; // ✅ Add this import

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>  {/* ✅ Wrap App with AuthProvider */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);
