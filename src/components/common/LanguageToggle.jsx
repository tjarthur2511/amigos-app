// src/components/common/LanguageToggle.jsx
import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { auth, db } from "../../firebase";
import { doc, updateDoc } from "firebase/firestore";

const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Franais" },
  { code: "de", name: "Deutsch" },
  { code: "zh", name: "中文" },
  { code: "hi", name: "हिंदी" },
  { code: "ar", name: "العربية" },
  { code: "pt", name: "Português" },
  { code: "ru", name: "Русский" },
  { code: "ja", name: "日本語" },
  { code: "ko", name: "한국어" },
  { code: "tr", name: "Türkçe" },
  { code: "ur", name: "اردو" },
  { code: "bn", name: "বাংলা" },
];

const LanguageToggle = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef();

  const toggleMenu = () => setIsOpen(!isOpen);

  const changeLanguage = async (lng) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
    if (auth.currentUser) {
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, { language: lng });
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div style={{ position: "fixed", top: "3.75rem", right: "1rem", zIndex: 10010 }} ref={menuRef}>
      <button
        onClick={toggleMenu}
        style={{
          backgroundColor: isOpen ? "#FF6B6B" : "#FFFFFF",
          color: isOpen ? "#FFFFFF" : "#FF6B6B",
          border: "none",
          padding: "0.4rem 1rem",
          borderRadius: "9999px",
          fontSize: "0.9rem",
          fontFamily: "Comfortaa, sans-serif",
          fontWeight: "bold",
          cursor: "pointer",
          boxShadow: "0 3px 8px rgba(0,0,0,0.2)",
          transition: "background-color 0.3s ease, color 0.3s ease",
        }}
      >
        Language
      </button>

      {isOpen && (
        <div
          style={{
            marginTop: "0.5rem",
            background: "#fff",
            borderRadius: "1rem",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            padding: "0.5rem 0",
            position: "absolute",
            right: 0,
            width: "160px",
            maxHeight: "250px",
            overflowY: "auto",
            zIndex: 10011,
          }}
        >
          {languages.map(({ code, name }) => (
            <div
              key={code}
              onClick={() => changeLanguage(code)}
              style={{
                padding: "0.5rem 1rem",
                fontFamily: "Comfortaa, sans-serif",
                fontSize: "0.9rem",
                cursor: "pointer",
                color: "#FF6B6B",
                textAlign: "left",
              }}
              onMouseEnter={(e) => (e.target.style.background = "#fff5f5")}
              onMouseLeave={(e) => (e.target.style.background = "transparent")}
            >
              {name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageToggle;