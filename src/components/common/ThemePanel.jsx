import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";

const presets = [
  {
    name: "Amigo Light",
    themeColor: "#FF6B6B",
    textColor: "#FFFFFF",
    hoverColor: "#FFA3A3",
  },
  {
    name: "Amigo Dark",
    themeColor: "#1a1a1a",
    textColor: "#FFFFFF",
    hoverColor: "#333333",
  },
  {
    name: "Ocean Night",
    themeColor: "#0f172a",
    textColor: "#FFFFFF",
    hoverColor: "#1e293b",
  },
  {
    name: "Sunset Punch",
    themeColor: "#FF7043",
    textColor: "#FFFFFF",
    hoverColor: "#FF5722",
  },
];

const swatches = [
  "#FF6B6B", "#4CAF50", "#2196F3", "#FFC107", "#9C27B0",
  "#00BCD4", "#FF9800", "#E91E63", "#3F51B5", "#8BC34A",
  "#212121", "#1a1a1a", "#0f172a", "#283593", "#FFD700"
];

const ThemePanel = ({ onClose }) => {
  const { currentUser } = useAuth();
  const [primary, setPrimary] = useState("#FF6B6B");
  const [text, setText] = useState("#FFFFFF");
  const [hover, setHover] = useState("#FFA3A3");

  useEffect(() => {
    if (!currentUser) return;
    const loadTheme = async () => {
      const ref = doc(db, "users", currentUser.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const theme = snap.data()?.theme;
        if (theme) {
          setPrimary(theme.themeColor || "#FF6B6B");
          setText(theme.textColor || "#FFFFFF");
          setHover(theme.hoverColor || "#FFA3A3");
          applyTheme(theme.themeColor, theme.textColor, theme.hoverColor);
        }
      }
    };
    loadTheme();
  }, [currentUser]);

  const applyTheme = (p, t, h) => {
    document.documentElement.style.setProperty("--theme-color", p);
    document.documentElement.style.setProperty("--text-color", t);
    document.documentElement.style.setProperty("--hover-color", h);
  };

  const applyPreset = (preset) => {
    setPrimary(preset.themeColor);
    setText(preset.textColor);
    setHover(preset.hoverColor);
    applyTheme(preset.themeColor, preset.textColor, preset.hoverColor);
  };

  const handleSave = async () => {
    applyTheme(primary, text, hover);
    if (currentUser) {
      await updateDoc(doc(db, "users", currentUser.uid), {
        theme: {
          themeColor: primary,
          textColor: text,
          hoverColor: hover,
        },
      });
    }
    onClose();
  };

  const renderSwatch = (current, setter) => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.5rem" }}>
      {swatches.map((color) => (
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
        top: "2.5rem",
        right: "1rem",
        width: "360px",
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

      <div style={sectionStyle}>
        <h3 style={labelStyle}>Presets</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {presets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset)}
              style={{
                padding: "0.4rem 0.8rem",
                backgroundColor: preset.themeColor,
                color: preset.textColor,
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
        {renderSwatch(primary, setPrimary)}
      </div>

      <div style={sectionStyle}>
        <h3 style={labelStyle}>Text Color</h3>
        {renderSwatch(text, setText)}
      </div>

      <div style={sectionStyle}>
        <h3 style={labelStyle}>Hover Color</h3>
        {renderSwatch(hover, setHover)}
      </div>

      <button
        onClick={handleSave}
        style={{
          marginTop: "1rem",
          backgroundColor: primary,
          color: text,
          padding: "0.5rem 1rem",
          width: "100%",
          border: "none",
          borderRadius: "9999px",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        Save Theme
      </button>

      <button
        onClick={onClose}
        style={{
          marginTop: "0.5rem",
          backgroundColor: "#FF6B6B",
          color: "#fff",
          padding: "0.5rem 1rem",
          width: "100%",
          border: "none",
          borderRadius: "9999px",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        Close
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

export default ThemePanel;
