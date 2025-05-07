import React from "react";

const FallingAEffect = () => {
  const numberOfAs = 30;

  const generateStyle = () => ({
    position: "absolute",
    top: `-${Math.random() * 200 + 50}px`, // Starts way above screen
    left: `${Math.random() * 100}%`,
    width: `${20 + Math.random() * 30}px`,
    height: "auto",
    animation: `fall ${5 + Math.random() * 5}s linear ${Math.random() * 5}s infinite`,
    filter: "drop-shadow(0 0 2px #FF6B6B) drop-shadow(0 0 4px #FF6B6B)",
    pointerEvents: "none",
    opacity: 0.8,
  });

  const aElements = Array.from({ length: numberOfAs }).map((_, index) => (
    <img
      key={index}
      src="/assets/amigosaonly.png"
      alt="a"
      style={generateStyle()}
    />
  ));

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        zIndex: 5000, // ⬅️ This ensures it’s above coral bg but below buttons
        pointerEvents: "none",
      }}
    >
      {aElements}
    </div>
  );
};

export default FallingAEffect;
