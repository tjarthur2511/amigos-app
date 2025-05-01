// src/components/common/LanguageToggle.jsx
import React, { useState } from "react";

const LanguageToggle = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={() => alert("Language selector coming soon!")}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: "fixed",
        top: "3.75rem",
        right: "1rem",
        backgroundColor: isHovered ? "#e15555" : "#FFFFFF",
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
      Language
    </button>
  );
};

export default LanguageToggle;
