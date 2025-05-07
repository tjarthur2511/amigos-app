import React from "react";

const GlobalSearch = () => {
  const handleClick = () => {
    alert("Open search modal or perform global search...");
  };

  return (
    <div
      style={{
        position: "absolute",
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
          padding: "0.5rem 1.2rem",
          fontSize: "0.9rem",
          color: "#FF6B6B",
          fontFamily: "Comfortaa, sans-serif",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
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
        🔍 Search
      </button>
    </div>
  );
};

export default GlobalSearch;
