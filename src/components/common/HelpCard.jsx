// src/components/common/HelpCard.jsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const HelpCard = ({ onClose }) => {
  const { i18n } = useTranslation();
  const [accessibility, setAccessibility] = useState(false);
  const [pushAlerts, setPushAlerts] = useState(false);
  const [weeklySuggestions, setWeeklySuggestions] = useState(false);

  const handleLanguageChange = (e) => {
    const lng = e.target.value;
    i18n.changeLanguage(lng);
    document.documentElement.lang = lng;
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "1.5rem",
        right: "26rem",
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
      <h2 style={{ fontSize: "1.6rem", marginBottom: "1rem", fontWeight: "bold" }}>Amigos Dashboard</h2>

      {/* Language */}
      <div style={sectionStyle}>
        <h3 style={labelStyle}>Language</h3>
        <p>Change your preferred language.</p>
        <select defaultValue={i18n.language} onChange={handleLanguageChange} style={inputStyle}>
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
          <option value="de">Deutsch</option>
          <option value="pt">Português</option>
          <option value="ja">日本語</option>
          <option value="ko">한국어</option>
          <option value="it">Italiano</option>
          <option value="hi">Hindi</option>
          <option value="ar">Arabic</option>
          <option value="ru">Russian</option>
          <option value="zh">Chinese</option>
        </select>
      </div>

      {/* Accessibility */}
      <div style={sectionStyle}>
        <h3 style={labelStyle}>Accessibility</h3>
        <p>Enable features like larger text or high contrast mode.</p>
        <button style={buttonStyle} onClick={() => setAccessibility(!accessibility)}>
          {accessibility ? "Disable" : "Enable"} Accessibility Mode
        </button>
      </div>

      {/* Notifications */}
      <div style={sectionStyle}>
        <h3 style={labelStyle}>Notifications</h3>
        <label>
          <input type="checkbox" checked={pushAlerts} onChange={() => setPushAlerts(!pushAlerts)} style={{ marginRight: "0.5rem" }} />
          Enable push alerts
        </label>
        <br />
        <label>
          <input type="checkbox" checked={weeklySuggestions} onChange={() => setWeeklySuggestions(!weeklySuggestions)} style={{ marginRight: "0.5rem" }} />
          Weekly suggestions
        </label>
      </div>

      {/* Account Info */}
      <div style={sectionStyle}>
        <h3 style={labelStyle}>Account Info</h3>
        <button style={buttonStyle}>Edit Profile</button>
        <button style={buttonStyle}>Change Password</button>
      </div>

      {/* Privacy & Support */}
      <div style={sectionStyle}>
        <h3 style={labelStyle}>Support</h3>
        <button style={buttonStyle}>Report a Bug</button>
        <button style={buttonStyle}>Submit Feedback</button>
        <button style={buttonStyle}>Contact Support</button>
      </div>

      <button
        onClick={onClose}
        style={{
          marginTop: "1rem",
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

const sectionStyle = {
  marginBottom: "1.5rem",
};

const labelStyle = {
  fontSize: "1.1rem",
  fontWeight: "bold",
  marginBottom: "0.5rem",
};

const inputStyle = {
  padding: "0.5rem",
  borderRadius: "9999px",
  border: "1px solid #FF6B6B",
  marginTop: "0.5rem",
  width: "100%",
  fontFamily: "Comfortaa, sans-serif",
};

const buttonStyle = {
  display: "block",
  width: "100%",
  marginTop: "0.5rem",
  padding: "0.4rem 0.8rem",
  borderRadius: "9999px",
  backgroundColor: "#fff0f0",
  color: "#FF6B6B",
  border: "1px solid #FF6B6B",
  fontFamily: "Comfortaa, sans-serif",
  cursor: "pointer",
};

export default HelpCard;