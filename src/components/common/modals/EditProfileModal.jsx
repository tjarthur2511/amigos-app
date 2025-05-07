import React, { useState } from "react";

const EditProfileModal = ({ onClose }) => {
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");

  const handleSave = async () => {
    // 🔧 Plug into Firestore update later
    console.log("Saving profile:", { displayName, bio });
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "6rem",
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
        Edit Profile
      </h2>

      <div style={{ marginBottom: "1rem" }}>
        <label style={labelStyle}>Display Name</label>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Enter your name"
          style={inputStyle}
        />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label style={labelStyle}>Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell us about yourself"
          style={{ ...inputStyle, height: "80px", resize: "none" }}
        />
      </div>

      <button onClick={handleSave} style={saveButtonStyle}>
        Save Changes
      </button>

      <button
        onClick={onClose}
        style={{
          marginTop: "0.5rem",
          backgroundColor: "#fff0f0",
          color: "#FF6B6B",
          padding: "0.5rem 1rem",
          borderRadius: "9999px",
          border: "1px solid #FF6B6B",
          fontFamily: "Comfortaa, sans-serif",
          cursor: "pointer",
          width: "100%",
        }}
      >
        Cancel
      </button>
    </div>
  );
};

const labelStyle = {
  fontSize: "0.95rem",
  fontWeight: "bold",
  marginBottom: "0.25rem",
  display: "block",
};

const inputStyle = {
  width: "100%",
  padding: "0.6rem 1rem",
  borderRadius: "9999px",
  border: "1px solid #ccc",
  fontFamily: "Comfortaa, sans-serif",
};

const saveButtonStyle = {
  marginTop: "0.5rem",
  backgroundColor: "#FF6B6B",
  color: "#fff",
  padding: "0.6rem",
  width: "100%",
  border: "none",
  borderRadius: "9999px",
  fontWeight: "bold",
  fontSize: "1rem",
  cursor: "pointer",
};

export default EditProfileModal;
