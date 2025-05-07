// src/components/common/ThemeToggle.jsx
import React, { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import ThemeModal from "./ThemeModal";

const ThemeToggle = () => {
  const { currentUser } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const handleSelectTheme = async (theme) => {
    if (!currentUser) return;

    try {
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        themeColor: theme.color,
        textColor: theme.text,
      });
      setShowModal(false);
    } catch (error) {
      console.error("Error saving theme:", error);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        style={{
          position: "fixed",
          top: "6.25rem",
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
        Theme
      </button>

      {showModal && (
        <ThemeModal onClose={() => setShowModal(false)} onSelect={handleSelectTheme} />
      )}
    </>
  );
};

export default ThemeToggle;