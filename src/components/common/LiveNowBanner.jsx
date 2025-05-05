// src/components/common/LiveNowBanner.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const LiveNowBanner = ({ liveStream }) => {
  const navigate = useNavigate();

  if (!liveStream) return null;

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300 }}
      onClick={() => navigate(`/live/${liveStream.id}`)}
      style={bannerStyle}
    >
      <div style={pulseDot} />
      <span style={textStyle}>@{liveStream.username} is live now</span>
      <span style={ctaStyle}>▶ Watch</span>
    </motion.div>
  );
};

const bannerStyle = {
  position: "fixed",
  top: "1rem",
  left: "50%",
  transform: "translateX(-50%)",
  zIndex: 10000,
  backgroundColor: "#fff",
  color: "#FF6B6B",
  border: "2px solid #FF6B6B",
  borderRadius: "9999px",
  padding: "0.6rem 1.2rem",
  display: "flex",
  alignItems: "center",
  gap: "0.6rem",
  fontFamily: "Comfortaa, sans-serif",
  fontWeight: "bold",
  boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
  cursor: "pointer",
  backdropFilter: "blur(5px)"
};

const pulseDot = {
  width: "10px",
  height: "10px",
  backgroundColor: "#FF6B6B",
  borderRadius: "50%",
  animation: "pulse 1.5s infinite"
};

const textStyle = {
  fontSize: "0.95rem"
};

const ctaStyle = {
  fontSize: "0.9rem",
  backgroundColor: "#FF6B6B",
  color: "#fff",
  padding: "0.2rem 0.6rem",
  borderRadius: "9999px"
};

export default LiveNowBanner;
