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
    if (!currentUser) return;
    const fetchTheme = async () => {
      const ref = doc(db, "users", currentUser.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        if (data.themeColor) {
          setSelectedColor(data.themeColor);
          applyTheme(data.themeColor);
        }
      }
    };
    fetchTheme();
  }, [currentUser]);

  const applyTheme = (color) => {
    document.documentElement.style.setProperty("--theme-color", color);
  };

  const handleColorSelect = async (color) => {
    setSelectedColor(color);
    applyTheme(color);
    if (!currentUser) return;
    await updateDoc(doc(db, "users", currentUser.uid), {
      themeColor: color,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 font-comfortaa">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl relative">
        <button
          className="absolute top-3 right-3 text-[#FF6B6B] hover:bg-[#FF6B6B] hover:text-white transition-colors p-1 rounded-full"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4 text-[#FF6B6B] text-center">Choose Theme Color</h2>
        <div className="grid grid-cols-3 gap-4 overflow-y-auto max-h-72">
          {COLORS.map((color) => (
            <button
              key={color.value}
              className={`w-full h-12 rounded-full border-4 transition-all ${
                selectedColor === color.value ? "border-black" : "border-transparent"
              }`}
              style={{ backgroundColor: color.value }}
              onClick={() => handleColorSelect(color.value)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThemePanel;
