import React from "react";

const FallingAEffect = () => {
  const numberOfAs = 30;

  const randomStyle = () => ({
    position: "absolute",
    left: `${Math.random() * 100}%`,
    top: `-${Math.random() * 300}px`,
    fontSize: `${20 + Math.random() * 30}px`,
    color: "#FF6B6B",
    opacity: 0.3,
    fontFamily: "Comfortaa, sans-serif", // ✅ ADD THIS
    animation: `fall ${8 + Math.random() * 8}s linear infinite`,
    animationDelay: `${Math.random() * 5}s`,
  });

  return (
    <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", overflow: "hidden", zIndex: 0 }}>
      {Array.from({ length: numberOfAs }).map((_, idx) => (
        <span key={idx} style={randomStyle()}>a</span>
      ))}
    </div>
  );
};

export default FallingAEffect;
