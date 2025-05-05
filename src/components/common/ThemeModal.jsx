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
    "#CDDC39", "#FF5722", "#BDBDBD", "#03A9F4", "#A1887F"
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
  
    const handleSave = async () => {
      if (!currentUser) return;
      const ref = doc(db, "users", currentUser.uid);
      await updateDoc(ref, {
        theme: { primary, text, hover },
      });
      onClose();
    };
  
    const renderSwatches = (label, current, setter) => (
      <div style={{ marginBottom: "1.5rem" }}>
        <p style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>{label}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
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
      </div>
    );
  
    return (
      <div style={{
        position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", zIndex: 10000,
        display: "flex", justifyContent: "center", alignItems: "center"
      }}>
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
            position: "relative"
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: "absolute", top: "1rem", right: "1rem",
              background: "transparent", border: "none", fontSize: "1.5rem",
              color: "#FF6B6B", cursor: "pointer"
            }}
          >
            ✕
          </button>
  
          <h2 style={{
            textAlign: "center",
            color: "#FF6B6B",
            marginBottom: "1.5rem",
            fontSize: "1.75rem"
          }}>
            Customize Theme
          </h2>
  
          {renderSwatches("Primary Color", primary, setPrimary)}
          {renderSwatches("Text Color", text, setText)}
          {renderSwatches("Hover Color", hover, setHover)}
  
          <button
            onClick={handleSave}
            style={{
              marginTop: "1rem",
              backgroundColor: primary,
              color: text,
              border: "none",
              padding: "0.75rem 1.5rem",
              borderRadius: "9999px",
              cursor: "pointer",
              fontWeight: "bold",
              width: "100%"
            }}
          >
            Save Theme
          </button>
        </motion.div>
      </div>
    );
  };
  
  export default ThemeModal;
  
  
  