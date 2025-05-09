import React, { useState } from "react";
import PostModal from "./PostModal";

const NewPostButton = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        style={{
          position: "fixed",
          bottom: "11rem", // responsive bottom offset
          left: "1rem", // consistent across screen sizes
          backgroundColor: "#FFFFFF",
          color: "#FF6B6B",
          border: "none",
          padding: "0.5rem 1.25rem",
          borderRadius: "9999px",
          fontSize: "0.9rem",
          fontFamily: "Comfortaa, sans-serif",
          fontWeight: "bold",
          cursor: "pointer",
          boxShadow: "0 3px 8px rgba(0,0,0,0.2)",
          zIndex: 1000000,
          transition: "all 0.2s ease-in-out",
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
        + Post
      </button>

      {showModal && <PostModal onClose={() => setShowModal(false)} />}
    </>
  );
};

export default NewPostButton;
