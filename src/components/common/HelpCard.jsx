// src/components/common/HelpCard.jsx
import React from "react";

const HelpCard = ({ onClose }) => {
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
        zIndex: 10010,
        maxHeight: "80vh",
        overflowY: "auto",
      }}
    >
      <h2 style={{ fontSize: "1.6rem", marginBottom: "1rem", fontWeight: "bold" }}>Amigos Dashboard</h2>

      {/* Language */}
      <div style={sectionStyle}>
        <h3 style={labelStyle}>Language</h3>
        <p>Change your preferred language.</p>
        <select style={inputStyle}>
          <option>English</option>
          <option>Español</option>
          <option>Français</option>
          <option>Deutsch</option>
          <option>Português</option>
          <option>日本語 (Japanese)</option>
          <option>한국어 (Korean)</option>
          <option>Italiano</option>
          <option>Hindi</option>
          <option>Arabic</option>
          <option>Russian</option>
          <option>Chinese</option>
        </select>
      </div>

      {/* Accessibility */}
      <div style={sectionStyle}>
        <h3 style={labelStyle}>Accessibility</h3>
        <p>Enable features for easier use like larger text or contrast mode.</p>
        <button style={buttonStyle}>Toggle Accessibility Mode</button>
      </div>

      {/* Privacy & Security */}
      <div style={sectionStyle}>
        <h3 style={labelStyle}>Privacy & Security</h3>
        <button style={buttonStyle}>Manage Data</button>
        <button style={buttonStyle}>Two-Factor Auth</button>
      </div>

      {/* Notifications */}
      <div style={sectionStyle}>
        <h3 style={labelStyle}>Notifications</h3>
        <label>
          <input type="checkbox" style={{ marginRight: "0.5rem" }} /> Enable push alerts
        </label>
        <br />
        <label>
          <input type="checkbox" style={{ marginRight: "0.5rem" }} /> Weekly suggestions
        </label>
      </div>

      {/* Account Info */}
      <div style={sectionStyle}>
        <h3 style={labelStyle}>Account Info</h3>
        <button style={buttonStyle}>Edit Profile</button>
        <button style={buttonStyle}>Change Password</button>
      </div>

      {/* Help Topics */}
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