// src/components/landing/AnimatedAmigoLogo.jsx
import React from "react";
import { motion } from "framer-motion";

const AnimatedAmigoLogo = () => {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ rotate: 360, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
      style={{
        width: 120,
        height: 120,
        borderRadius: "50%",
        backgroundColor: "#FF6B6B",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Comfortaa', cursive",
        fontSize: "3rem",
        color: "#ffffff",
        fontWeight: "bold",
        boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
      }}
    >
      a
    </motion.div>
  );
};

export default AnimatedAmigoLogo;
