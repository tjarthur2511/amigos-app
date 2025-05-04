// src/components/common/MapHangoutsModal.jsx
import React from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "300px",
  borderRadius: "0.75rem",
};

const center = {
  lat: 42.3314, // Michigan
  lng: -83.0458,
};

const MapHangoutsModal = ({ onClose }) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyDx4pT2nVGzixl1k7r54GkSTI8Yab8fOAk", // ✅ your real key
  });

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        zIndex: 10000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Comfortaa, sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "1.25rem",
          padding: "1.5rem",
          boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
          width: "90%",
          maxWidth: "600px",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "12px",
            right: "16px",
            fontSize: "1.2rem",
            color: "#FF6B6B",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px 8px",
            borderRadius: "9999px",
            transition: "all 0.2s ease-in-out",
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = "#FF6B6B";
            e.target.style.color = "white";
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = "transparent";
            e.target.style.color = "#FF6B6B";
          }}
        >
          ✕
        </button>

        <h2
          style={{
            textAlign: "center",
            color: "#FF6B6B",
            fontSize: "1.5rem",
            marginBottom: "1rem",
          }}
        >
          Map Hangouts
        </h2>

        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={10}
          />
        ) : (
          <p style={{ textAlign: "center", color: "#888" }}>Loading map...</p>
        )}
      </div>
    </div>
  );
};

export default MapHangoutsModal;
