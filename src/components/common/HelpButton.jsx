// src/components/common/HelpButton.jsx
import React from "react";

const HelpButton = () => {
  return (
    <button
      onClick={() => alert("Need help? Help center coming soon!")}
      style={{
        position: "fixed",
        top: "6.25rem",
        right: "1rem",
        backgroundColor: "#FFFFFF",
        color: "#FF6B6B",
        border: "none",
        padding: "0.4rem 1rem",
        borderRadius: "9999px",
        fontSize: "0.9rem",
        fontFamily: "Comfortaa, sans-serif",
        fontWeight: "bold",
        cursor: "pointer",
        boxShadow: "0 3px 8px rgba(0,0,0,0.2)",
        zIndex: 9999
      }}
    >
      Help
    </button>
  );
};

export default HelpButton;
