// src/components/common/NewPostButton.jsx
import React from "react";

const NewPostButton = () => {
  return (
    <button
      onClick={() => alert("Post modal coming soon!")}
      style={{
        position: "fixed",
        top: "17rem",
        left: "1rem",
        transform: "translateY(-50%)",
        backgroundColor: "#FFFFFF",
        color: "#FF6B6B",
        border: "none",
        padding: "0.5rem 1rem",
        borderRadius: "9999px",
        fontSize: "0.9rem",
        fontFamily: "Comfortaa, sans-serif",
        fontWeight: "bold",
        cursor: "pointer",
        boxShadow: "0 3px 8px rgba(0,0,0,0.2)",
        zIndex: 9999,
      }}
    >
      + Post
    </button>
  );
};

export default NewPostButton;
