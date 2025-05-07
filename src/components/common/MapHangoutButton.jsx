// src/components/common/MapHangoutButton.jsx
import React, { useState } from "react";
import MapHangoutsModal from "./MapHangoutsModal";

const MapHangoutButton = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        style={{
          position: "fixed",
          top: "297px", // slightly below + Post (255px)
          left: "16px",
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
          zIndex: 999999,
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
        + Map
      </button>

      {showModal && <MapHangoutsModal onClose={() => setShowModal(false)} />}
    </>
  );
};

export default MapHangoutButton;
