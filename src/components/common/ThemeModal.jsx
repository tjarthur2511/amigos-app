// src/components/common/ThemeModal.jsx
import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";

const presets = [
  {
    name: "Amigo Light",
    primary: "#FF6B6B",
    text: "#FFFFFF",
    hover: "#FFA3A3",
  },
  {
    name: "Amigo Dark",
    primary: "#1a1a1a",
    text: "#FFFFFF",
    hover: "#333333",
  },
  {
    name: "Ocean Night",
    primary: "#0f172a",
    text: "#FFFFFF",
    hover: "#1e293b",
  },
  {
    name: "Sunset Punch",
    primary: "#FF7043",
    text: "#FFFFFF",
    hover: "#FF5722",
  },
];

const colorSwatch = [
  "#FF6B6B", "#4CAF50", "#2196F3", "#FFC107", "#9C27B0",
  "#00BCD4", "#FF9800", "#E91E63", "#3F51B5", "#8BC34A",
  "#212121", "#1a1a1a", "#0f172a", "#283593", "#FFD700"
];

const ThemeModal = ({ onClose }) => {
  const { currentUser } = useAuth();
  const [primary, setPrimary] = useState("#FF6B6B");
  const [text, setText] = useState("#FFFFFF");
  const [hover, setHover] = useState("#FFA3A3");

  useEffect(() => {
    document.documentElement.style.setProperty("--primary", primary);
    document.documentElement.style.setProperty("--text", text);
    document.documentElement.style.setProperty("--hover", hover);
  }, [primary, text, hover]);

  const applyPreset = (preset) => {
    setPrimary(preset.primary);
    setText(preset.text);
    setHover(preset.hover);
  };

  const handleSave = async () => {
    if (!currentUser) return;
    const ref = doc(db, "users", currentUser.uid);
    await updateDoc(ref, {
      theme: { primary, text, hover },
    });
    onClose();
  };

  const renderColors = (current, setter) => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.5rem" }}>
      {colorSwatch.map((color) => (
        <button
          key={color}
          onClick={() => setter(color)}
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            backgroundColor: color,
            border: color === current ? "3px solid black" : "1px solid #ccc",
            cursor: "pointer",
          }}
        />
      ))}
    </div>
  );

  return (
    <div
      style={{
        position: "fixed",
        top: "6rem",
        right: "1rem",
        width: "340px",
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
      <h2 style={{ fontSize: "1.6rem", marginBottom: "1rem", fontWeight: "bold", textAlign: "center" }}>
        Customize Theme
      </h2>

      <div style={{ marginBottom: "1.5rem" }}>
        <h3 style={labelStyle}>Presets</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {presets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset)}
              style={{
                padding: "0.4rem 0.8rem",
                backgroundColor: preset.primary,
                color: preset.text,
                borderRadius: "9999px",
                fontWeight: "bold",
                fontSize: "0.8rem",
                border: "none",
                cursor: "pointer",
              }}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      <div style={sectionStyle}>
        <h3 style={labelStyle}>Base Color</h3>
        {renderColors(primary, setPrimary)}
      </div>

      <div style={sectionStyle}>
        <h3 style={labelStyle}>Text Color</h3>
        {renderColors(text, setText)}
      </div>

      <div style={sectionStyle}>
        <h3 style={labelStyle}>Hover Color</h3>
        {renderColors(hover, setHover)}
      </div>

      <button
        onClick={handleSave}
        style={{
          marginTop: "1.5rem",
          backgroundColor: primary,
          color: text,
          padding: "0.7rem",
          width: "100%",
          border: "none",
          borderRadius: "9999px",
          fontWeight: "bold",
          fontSize: "1rem",
          cursor: "pointer",
        }}
      >
        Save Theme
      </button>
    </div>
  );
};

const sectionStyle = {
  marginBottom: "1.5rem",
};

const labelStyle = {
  fontSize: "1.1rem",
  fontWeight: "bold",
  marginBottom: "0.25rem",
};

export default ThemeModal;
