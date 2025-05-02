// src/components/common/NewPostButton.jsx
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
          bottom: "29rem", // below the feed
          left: "1rem",
          backgroundColor: "#FFFFFF",
          color: "#FF6B6B",
          border: "none",
          padding: ".5rem 1rem",
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

      {showModal && <PostModal onClose={() => setShowModal(false)} />}
    </>
  );
};

export default NewPostButton;
