// src/components/common/ThemeModal.jsx
import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";

const colorOptions = [
  "#FF6B6B", "#4CAF50", "#2196F3", "#FFC107", "#9C27B0",
  "#00BCD4", "#FF9800", "#E91E63", "#3F51B5", "#8BC34A",
  "#673AB7", "#F44336", "#607D8B", "#795548", "#009688",
  "#CDDC39", "#FF5722", "#BDBDBD", "#03A9F4", "#A1887F",
  // Darker Colors
  "#1a1a1a", "#2d2d2d", "#333333", "#444444", "#555555",
  "#111827", "#0f172a", "#1e293b", "#1f2937", "#374151"
];

const presets = [
  {
    name: "Amigo Light",
    primary: "#FF6B6B",
    text: "#FFFFFF",
    hover: "#FFA3A3"
  },
  {
    name: "Amigo Dark",
    primary: "#1a1a1a",
    text: "#FFFFFF",
    hover: "#333333"
  },
  {
    name: "Ocean Night",
    primary: "#0f172a",
    text: "#FFFFFF",
    hover: "#1e293b"
  },
  {
    name: "Sunset Punch",
    primary: "#FF7043",
    text: "#FFFFFF",
    hover: "#FF5722"
  }
];

const ThemeModal = ({ onClose }) => {
  const { currentUser } = useAuth();
  const [primary, setPrimary] = useState("#FF6B6B");
  const [text, setText] = useState("#FFFFFF");
  const [hover, setHover] = useState("#FFA3A3");
  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    document.documentElement.style.setProperty("--primary", primary);
    document.documentElement.style.setProperty("--text", text);
    document.documentElement.style.setProperty("--hover", hover);
  }, [primary, text, hover]);

  const handleSave = async () => {
    if (!currentUser) return;
    const ref = doc(db, "users", currentUser.uid);
    await updateDoc(ref, {
      theme: { primary, text, hover },
    });
    onClose();
  };

  const applyPreset = (preset) => {
    setPrimary(preset.primary);
    setText(preset.text);
    setHover(preset.hover);
  };

  const renderColorPicker = (setter, current) => (
    <div className="grid grid-cols-5 gap-2 mt-3">
      {colorOptions.map((color) => (
        <button
          key={color}
          onClick={() => setter(color)}
          style={{
            backgroundColor: color,
            border: color === current ? "3px solid #000" : "2px solid #ccc",
            width: "32px",
            height: "32px",
            borderRadius: "9999px",
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
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.6)",
        zIndex: 10000,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        style={{
          background: "#fff",
          padding: "2rem",
          borderRadius: "1.5rem",
          width: "90%",
          maxWidth: "500px",
          fontFamily: "Comfortaa, sans-serif",
          boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
          maxHeight: "90vh",
          overflowY: "auto",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: "transparent",
            border: "none",
            fontSize: "1.5rem",
            color: "#FF6B6B",
            cursor: "pointer",
          }}
        >
          ✕
        </button>

        <h2
          style={{
            textAlign: "center",
            color: "#FF6B6B",
            marginBottom: "1.5rem",
            fontSize: "1.75rem",
          }}
        >
          Customize Theme
        </h2>

        <div className="space-y-4">
          <div>
            <p className="font-bold text-sm mb-1">Presets</p>
            <div className="grid grid-cols-2 gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => applyPreset(preset)}
                  className="py-2 px-3 rounded-full text-sm font-semibold shadow-md"
                  style={{ backgroundColor: preset.primary, color: preset.text }}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="font-bold text-sm mb-1">Base Color</p>
            <button
              className="w-full py-2 rounded-full border"
              style={{ backgroundColor: primary, color: text }}
              onClick={() => setActiveSection(activeSection === "primary" ? null : "primary")}
            >
              Choose Base Color
            </button>
            {activeSection === "primary" && renderColorPicker(setPrimary, primary)}
          </div>

          <div>
            <p className="font-bold text-sm mb-1">Text Color</p>
            <button
              className="w-full py-2 rounded-full border"
              style={{ backgroundColor: text, color: primary }}
              onClick={() => setActiveSection(activeSection === "text" ? null : "text")}
            >
              Choose Text Color
            </button>
            {activeSection === "text" && renderColorPicker(setText, text)}
          </div>

          <div>
            <p className="font-bold text-sm mb-1">Hover Color</p>
            <button
              className="w-full py-2 rounded-full border"
              style={{ backgroundColor: hover, color: text }}
              onClick={() => setActiveSection(activeSection === "hover" ? null : "hover")}
            >
              Choose Hover Color
            </button>
            {activeSection === "hover" && renderColorPicker(setHover, hover)}
          </div>
        </div>

        <button
          onClick={handleSave}
          style={{
            marginTop: "2rem",
            backgroundColor: primary,
            color: text,
            border: "none",
            padding: "0.75rem 1.5rem",
            borderRadius: "9999px",
            cursor: "pointer",
            fontWeight: "bold",
            width: "100%",
          }}
        >
          Save Theme
        </button>
      </motion.div>
    </div>
  );
};

export default ThemeModal;