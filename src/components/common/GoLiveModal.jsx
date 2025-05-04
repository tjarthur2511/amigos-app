// src/components/common/GoLiveModal.jsx
import React, { useState } from "react";

const GoLiveModal = ({ onClose }) => {
  const [isLive, setIsLive] = useState(false);

  const handleStartLive = () => setIsLive(true);
  const handleStopLive = () => setIsLive(false);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 10001,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "1.5rem",
          padding: "2rem",
          width: "100%",
          maxWidth: "640px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
          fontFamily: "Comfortaa, sans-serif",
          position: "relative",
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            fontSize: "1.5rem",
            fontWeight: "bold",
            color: "#FF6B6B",
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
        >
          ✕
        </button>

        {/* Minimize "a" if live */}
        {isLive && (
          <div
            style={{
              position: "absolute",
              top: "1rem",
              left: "1rem",
              backgroundColor: "#FF6B6B",
              color: "white",
              fontWeight: "bold",
              padding: "0.4rem 0.8rem",
              borderRadius: "9999px",
              animation: "pulse 2s infinite",
              fontFamily: "Comfortaa, sans-serif",
              cursor: "pointer",
            }}
            onClick={onClose}
          >
            a
          </div>
        )}

        <h2
          style={{
            fontSize: "1.75rem",
            fontWeight: "bold",
            color: "#FF6B6B",
            marginBottom: "1.5rem",
            textAlign: "center",
            textTransform: "lowercase",
          }}
        >
          go live
        </h2>

        {/* Video Preview */}
        <div
          style={{
            width: "100%",
            height: "240px",
            backgroundColor: "#ffecec",
            borderRadius: "1rem",
            marginBottom: "1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#FF6B6B",
            fontWeight: "bold",
            fontSize: "1.1rem",
          }}
        >
          {isLive ? "📡 Live Stream Preview" : "Waiting to go live..."}
        </div>

        {/* Start/Stop Live Buttons */}
        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginBottom: "1rem" }}>
          {!isLive ? (
            <button
              onClick={handleStartLive}
              style={{
                backgroundColor: "#FF6B6B",
                color: "white",
                padding: "0.5rem 1rem",
                borderRadius: "9999px",
                border: "none",
                cursor: "pointer",
                fontWeight: "bold",
                fontFamily: "Comfortaa, sans-serif",
              }}
            >
              Start Live
            </button>
          ) : (
            <button
              onClick={handleStopLive}
              style={{
                backgroundColor: "#ccc",
                color: "#333",
                padding: "0.5rem 1rem",
                borderRadius: "9999px",
                border: "none",
                cursor: "pointer",
                fontWeight: "bold",
                fontFamily: "Comfortaa, sans-serif",
              }}
            >
              Stop Live
            </button>
          )}
        </div>

        {/* Comment Section */}
        <div style={{ maxHeight: "150px", overflowY: "auto", marginBottom: "1rem" }}>
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              style={{
                padding: "0.5rem",
                borderBottom: "1px solid #eee",
                color: "#555",
                fontSize: "0.95rem",
              }}
            >
              <strong>User{i + 1}:</strong> This is a comment.
            </div>
          ))}
        </div>

        {/* Comment Input */}
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <input
            type="text"
            placeholder="Leave a comment..."
            style={{
              flex: 1,
              padding: "0.5rem 1rem",
              borderRadius: "9999px",
              border: "1px solid #ccc",
              fontFamily: "Comfortaa, sans-serif",
            }}
          />
          <button
            style={{
              backgroundColor: "#FF6B6B",
              color: "white",
              border: "none",
              padding: "0.5rem 1rem",
              borderRadius: "9999px",
              cursor: "pointer",
              fontFamily: "Comfortaa, sans-serif",
              fontWeight: "bold",
            }}
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoLiveModal;
