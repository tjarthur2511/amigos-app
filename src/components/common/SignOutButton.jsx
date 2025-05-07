import React from "react";
import { auth } from "../../firebase";

const SignOutButton = () => {
  return (
    <button
      onClick={() => auth.signOut()}
      style={{
        position: "fixed",
        top: "1rem",
        right: "1rem",
        backgroundColor: "#FFFFFF",
        color: "#FF6B6B",
        border: "none",
        padding: "0.6rem 1.5rem",
        borderRadius: "9999px",
        fontSize: "1rem",
        fontFamily: "Comfortaa, sans-serif",
        fontWeight: "bold",
        cursor: "pointer",
        boxShadow: "0 3px 8px rgba(0,0,0,0.2)",
        zIndex: 999999,
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
      onMouseOver={(e) => {
        e.target.style.backgroundColor = "#FF6B6B";
        e.target.style.color = "#FFFFFF";
      }}
      onMouseOut={(e) => {
        e.target.style.backgroundColor = "#FFFFFF";
        e.target.style.color = "#FF6B6B";
      }}
    >
      Sign Out
    </button>
  );
};

export default SignOutButton;
