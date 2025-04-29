import React from "react";

const FallingAEffect = () => {
  const numberOfAs = 30;

  const randomStyle = () => ({
    position: "absolute",
    left: `${Math.random() * 100}%`,
    top: `-${Math.random() * 300}px`,
    width: `${10 + Math.random() * 80}px`,
    height: "auto",
    opacity: 0.8,
    animationDuration: `${8 + Math.random() * 8}s`,
    animationDelay: `${Math.random() * 5}s`,
  });

  return (
    <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
      {Array.from({ length: numberOfAs }).map((_, idx) => (
        <img
          key={idx}
          src="/assets/amigosaonly.png"  // ✅ Correct small 'a' logo
          alt="a"
          className="absolute opacity-80 animate-fall"
          style={randomStyle()}
        />
      ))}
    </div>
  );
};

export default FallingAEffect;
