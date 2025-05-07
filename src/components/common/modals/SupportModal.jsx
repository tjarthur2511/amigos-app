// src/components/common/modals/SupportModal.jsx
import React, { useState } from "react";

const SupportModal = ({ onClose }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (!selectedOption || !message.trim()) {
      alert("Please select an issue type and write a message.");
      return;
    }

    // Placeholder for backend logic
    console.log("Submitting support request:", { selectedOption, message });

    // Reset and close
    setSelectedOption("");
    setMessage("");
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "6rem",
        right: "1rem",
        width: "340px",
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
      <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>
        Contact Support
      </h2>

      <label style={labelStyle}>Type of Issue</label>
      <select
        value={selectedOption}
        onChange={(e) => setSelectedOption(e.target.value)}
        style={selectStyle}
      >
        <option value="">Select</option>
        <option value="bug">Bug Report</option>
        <option value="feedback">Feedback</option>
        <option value="account">Account Help</option>
        <option value="other">Other</option>
      </select>

      <label style={{ ...labelStyle, marginTop: "1rem" }}>Your Message</label>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={4}
        style={textAreaStyle}
        placeholder="Describe your issue..."
      />

      <button onClick={handleSubmit} style={buttonStyle}>
        Submit
      </button>
      <button
        onClick={onClose}
        style={{ ...buttonStyle, backgroundColor: "#eee", color: "#FF6B6B", marginTop: "0.5rem" }}
      >
        Cancel
      </button>
    </div>
  );
};

const labelStyle = {
  fontWeight: "bold",
  fontSize: "1rem",
  marginBottom: "0.25rem",
  display: "block",
};

const selectStyle = {
  width: "100%",
  padding: "0.5rem",
  borderRadius: "9999px",
  border: "1px solid #FF6B6B",
  fontFamily: "Comfortaa, sans-serif",
};

const textAreaStyle = {
  width: "100%",
  padding: "0.6rem",
  borderRadius: "1rem",
  border: "1px solid #FF6B6B",
  fontFamily: "Comfortaa, sans-serif",
  resize: "vertical",
  marginTop: "0.25rem",
};

const buttonStyle = {
  width: "100%",
  padding: "0.6rem",
  backgroundColor: "#FF6B6B",
  color: "#fff",
  border: "none",
  borderRadius: "9999px",
  fontWeight: "bold",
  fontFamily: "Comfortaa, sans-serif",
  marginTop: "1rem",
  cursor: "pointer",
};

export default SupportModal;
