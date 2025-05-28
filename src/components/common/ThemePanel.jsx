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

  // Define Tailwind classes
  const modalContainerClasses = "fixed top-10 right-4 w-96 bg-white text-coral p-6 rounded-[1.5rem] shadow-[0_4px_20px_rgba(255,107,107,0.4)] font-comfortaa z-[100010] max-h-[80vh] overflow-y-auto flex flex-col gap-4";
  const titleClasses = "text-2xl font-bold text-center"; // text-2xl for 1.6rem approx
  const sectionClasses = "space-y-2"; // Replaces marginBottom
  const labelClasses = "text-lg font-bold text-coral"; // text-lg for 1.1rem approx
  const swatchContainerClasses = "flex flex-wrap gap-2 mt-2";
  const swatchButtonBaseClasses = "w-8 h-8 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2";
  const presetButtonBaseClasses = "py-1.5 px-3 rounded-full font-bold text-xs border-none cursor-pointer hover:opacity-90 transition-opacity";
  const actionButtonClasses = "w-full py-2 px-4 rounded-full font-bold cursor-pointer transition-colors duration-150";


  const renderSwatch = (current, setter) => (
    <div className={swatchContainerClasses}>
      {swatches.map((color) => (
        <button
          key={color}
          onClick={() => setter(color)}
          className={`${swatchButtonBaseClasses} ${color === current ? 'ring-2 ring-black' : 'ring-1 ring-gray-300'}`}
          style={{ backgroundColor: color }} // Inline style for dynamic background is acceptable
        />
      ))}
    </div>
  );

  return (
    <div className={modalContainerClasses}>
      <h2 className={titleClasses}>
        Customize Theme
      </h2>

      <div className={sectionClasses}>
        <h3 className={labelClasses}>Presets</h3>
        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset)}
              className={presetButtonBaseClasses}
              style={{ backgroundColor: preset.themeColor, color: preset.textColor }} // Dynamic styles
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      <div className={sectionClasses}>
        <h3 className={labelClasses}>Base Color</h3>
        {renderSwatch(primary, setPrimary)}
      </div>

      <div className={sectionClasses}>
        <h3 className={labelClasses}>Text Color</h3>
        {renderSwatch(text, setText)}
      </div>

      <div className={sectionClasses}>
        <h3 className={labelClasses}>Hover Color</h3>
        {renderSwatch(hover, setHover)}
      </div>

      <button
        onClick={handleSave}
        className={`${actionButtonClasses} mt-4`} // Added mt-4 for spacing from sections
        style={{ backgroundColor: primary, color: text }} // Dynamic styles
      >
        Save Theme
      </button>

      <button
        onClick={onClose}
        className={`${actionButtonClasses} bg-coral text-white hover:bg-coral-dark`}
      >
        Close
      </button>
    </div>
  );
};

// Style object constants sectionStyle and labelStyle are no longer needed.

export default ThemePanel;
