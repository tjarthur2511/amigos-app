import React, { useState } from "react";

const ChangePasswordModal = ({ onClose }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSave = async () => {
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match.");
      return;
    }

    // 🔧 Hook up real password change logic with Firebase later
    console.log("Password change submitted", { currentPassword, newPassword });
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
        Change Password
      </h2>

      <div style={{ marginBottom: "1rem" }}>
        <label style={labelStyle}>Current Password</label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          style={inputStyle}
        />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label style={labelStyle}>New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          style={inputStyle}
        />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label style={labelStyle}>Confirm New Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={inputStyle}
        />
      </div>

      <button onClick={handleSave} style={saveButtonStyle}>
        Save New Password
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

export default ChangePasswordModal;
