import React from "react";
import { useNavigate } from "react-router-dom";
import FallingAEffect from "./FallingAEffect";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/signup");
  };

  return (
    <div style={{ backgroundColor: "#FF6B6B", minHeight: "100vh", position: "relative", overflow: "hidden", width: "100%" }}>
      <FallingAEffect />

      <div style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "white",
        padding: "1rem",
        borderRadius: "1rem",
        boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
        width: "90%",
        maxWidth: "500px",
        textAlign: "center",
        zIndex: 10,
      }}>
        <div style={{ marginBottom: "1rem" }}>
          <img
            src="/assets/amigos-a-logo.png"
            alt="amigos logo"
            style={{
              height: "9em",
              width: "auto",
              marginBottom: "-4rem",    // ✅ Added marginBottom to move logo closer to the phrase
              animation: "pulse-a 1.75s infinite"
            }}
          />
        </div>

        <p style={{ fontFamily: "Comfortaa, sans-serif", fontSize: "1.2rem", color: "#555", marginBottom: "2rem" }}>
          Find your place. Find your passion. Find your amigos
        </p>

        <button
          onClick={handleGetStarted}
          style={{
            backgroundColor: "#FF6B6B",
            color: "white",
            border: "none",
            padding: "12px 24px",
            borderRadius: "30px",
            fontSize: "1rem",
            fontFamily: "Comfortaa, sans-serif",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = "#e15555"}
          onMouseOut={(e) => e.target.style.backgroundColor = "#FF6B6B"}
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
