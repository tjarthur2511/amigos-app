import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const LiveNowBanner = ({ liveStream }) => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(true);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (!hovered) {
      const timer = setTimeout(() => setVisible(false), 6000);
      return () => clearTimeout(timer);
    }
  }, [hovered]);

  if (!liveStream || !visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300 }}
        onClick={() => navigate(`/live/${liveStream.id}`)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={bannerStyle}
      >
        <div style={pulseDot} />
        <span style={textStyle}>@{liveStream.username} is live now</span>
        <span style={ctaStyle}>▶ Watch</span>

        {hovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={hoverCardStyle}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/live/${liveStream.id}`);
            }}
          >
            <strong style={{ fontSize: "1rem" }}>Live Stream Preview</strong>
            <p style={{ fontSize: "0.85rem", marginTop: "0.25rem" }}>
              @{liveStream.username} is streaming now. Join to chat!
            </p>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
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
  backdropFilter: "blur(5px)",
};

const pulseDot = {
  width: "10px",
  height: "10px",
  backgroundColor: "#FF6B6B",
  borderRadius: "50%",
  animation: "pulse 1.5s infinite",
};

const textStyle = {
  fontSize: "0.95rem",
};

const ctaStyle = {
  fontSize: "0.9rem",
  backgroundColor: "#FF6B6B",
  color: "#fff",
  padding: "0.2rem 0.6rem",
  borderRadius: "9999px",
};

const hoverCardStyle = {
  position: "absolute",
  top: "3rem",
  left: "50%",
  transform: "translateX(-50%)",
  backgroundColor: "#fff",
  color: "#FF6B6B",
  padding: "1rem",
  borderRadius: "1rem",
  boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
  fontFamily: "Comfortaa, sans-serif",
  width: "250px",
  textAlign: "center",
  zIndex: 10001,
};

export default LiveNowBanner;
