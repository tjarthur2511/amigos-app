// src/components/common/NotificationsBell.jsx
import React from "react";

const NotificationsBell = () => {
  return (
    <button
      onClick={() => alert("Notifications coming soon!")}
      style={{
        position: "fixed",
        top: "12.25rem", // original position preserved
        left: "50%",
        transform: "translateX(15rem)", // original placement
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
      a
    </button>
  );
};

export default NotificationsBell;
