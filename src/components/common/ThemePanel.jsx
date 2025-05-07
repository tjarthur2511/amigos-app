// src/components/common/ThemePanel.jsx
import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";

const COLORS = [
  { name: "Amigo Coral", value: "#FF6B6B" },
  { name: "Sky Blue", value: "#4FC3F7" },
  { name: "Forest Green", value: "#2E7D32" },
  { name: "Sunset Orange", value: "#FF7043" },
  { name: "Royal Purple", value: "#9575CD" },
  { name: "Dark Mode Gray", value: "#212121" },
  { name: "Ocean Teal", value: "#00897B" },
  { name: "Candy Pink", value: "#EC407A" },
  { name: "Gold", value: "#FFD700" },
  { name: "Navy", value: "#283593" },
];

const ThemePanel = ({ onClose }) => {
  const { currentUser } = useAuth();
  const [selectedColor, setSelectedColor] = useState("#FF6B6B");

  useEffect(() => {
    const fetchTheme = async () => {
      if (!currentUser) return;
      const ref = doc(db, "users", currentUser.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        if (data.themeColor) {
          setSelectedColor(data.themeColor);
          document.documentElement.style.setProperty("--theme-color", data.themeColor);
        }
      }
    };
    fetchTheme();
  }, [currentUser]);

  const handleColorSelect = async (color) => {
    setSelectedColor(color);
    document.documentElement.style.setProperty("--theme-color", color);
    if (currentUser) {
      await updateDoc(doc(db, "users", currentUser.uid), {
        themeColor: color,
      });
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "6rem",
        right: "1rem",
        width: "320px",
        backgroundColor: "#fff",
        color: "#FF6B6B",
        padding: "1.5rem",
        borderRadius: "1.5rem",
        boxShadow: "0 4px 20px rgba(255, 107, 107, 0.4)",
        fontFamily: "Comfortaa, sans-serif",
        zIndex: 1000010,
        maxHeight: "80vh",
        overflowY: "auto",
      }}
    >
      <h2 style={{ fontSize: "1.6rem", marginBottom: "1rem", fontWeight: "bold" }}>
        Theme Settings
      </h2>

      <div style={{ marginBottom: "1.5rem" }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
          Pick a Color
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "0.5rem",
          }}
        >
          {COLORS.map((color) => (
            <button
              key={color.value}
              onClick={() => handleColorSelect(color.value)}
              title={color.name}
              style={{
                width: "100%",
                height: "2.5rem",
                borderRadius: "9999px",
                backgroundColor: color.value,
                border: selectedColor === color.value ? "3px solid black" : "1px solid #ccc",
                cursor: "pointer",
              }}
            />
          ))}
        </div>
      </div>

      <button
        onClick={onClose}
        style={{
          backgroundColor: "#FF6B6B",
          color: "#fff",
          padding: "0.5rem 1rem",
          borderRadius: "9999px",
          border: "none",
          fontWeight: "bold",
          cursor: "pointer",
          width: "100%",
        }}
      >
        Close
      </button>
    </div>
  );
};

export default ThemePanel;
