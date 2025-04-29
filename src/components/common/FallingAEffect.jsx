import React from "react";

const FallingAEffect = () => {
  const numberOfAs = 30;

  const randomPosition = () => ({
    left: `${Math.random() * 100}%`,
    animationDuration: `${5 + Math.random() * 5}s`,  // Random fall speed
    animationDelay: `${Math.random() * 5}s`,         // Random start time
    width: `${20 + Math.random() * 30}px`,           // Size range for each falling "a"
    height: "auto",
  });

  const aElements = Array.from({ length: numberOfAs }).map((_, index) => (
    <img
      key={index}
      src="/assets/amigosaonly.png"  // ✅ Your small amigo "a" image
      alt="a"
      className="absolute opacity-80 animate-fall pointer-events-none"
      style={randomPosition()}
    />
  ));

  return (
    <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
      {aElements}
    </div>
  );
};

export default FallingAEffect;
