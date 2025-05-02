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
        backgroundColor: isHovered ? "#FF6B6B" : "#FFFFFF",
        color: isHovered ? "#FFFFFF" : "#FF6B6B",
        border: "none",
        padding: "0.4rem 1rem",
        borderRadius: "9999px",
        fontSize: "0.9rem",
        fontFamily: "Comfortaa, sans-serif",
        fontWeight: "bold",
        cursor: "pointer",
        boxShadow: "0 3px 8px rgba(0,0,0,0.2)",
        zIndex: 9999,
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      Language
    </button>
  );
};

export default LanguageToggle;
