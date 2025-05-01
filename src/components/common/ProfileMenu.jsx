// src/components/common/ProfileMenu.jsx
import React from "react";

const ProfileMenu = () => {
  return (
    <button
      onClick={() => alert("Profile menu coming soon!")}
      style={{
        position: "fixed",
        top: "8.5rem",
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
      Settings
    </button>
  );
};

export default ProfileMenu;
