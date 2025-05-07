// src/components/common/GlobalSearch.jsx
import React from "react";

const GlobalSearch = () => {
  const handleClick = () => {
    // Placeholder for opening modal or performing search
    alert("Global search coming soon...");
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "1rem",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1000000,
        pointerEvents: "auto",
      }}
    >
      <button
        onClick={handleClick}
        style={{
          backgroundColor: "#FFFFFF",
          border: "2px solid #FF6B6B",
          borderRadius: "9999px",
          padding: "0.5rem 1.5rem",
          fontSize: "0.95rem",
          color: "#FF6B6B",
          fontFamily: "Comfortaa, sans-serif",
          fontWeight: "bold",
          cursor: "pointer",
          boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
          transition: "all 0.3s ease",
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
        Search Amigos & Grupos
      </button>
    </div>
  );
};

export default GlobalSearch;
