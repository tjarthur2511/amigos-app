import React from "react";

const GoLiveButton = () => {
  return (
    <button
      onClick={() => alert("Go Live feature coming soon!")}
      style={{
        position: "fixed",
        top: "13.5rem",
        left: "1rem",
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
        zIndex: 9999,
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
      Go Live
    </button>
  );
};

export default GoLiveButton;
