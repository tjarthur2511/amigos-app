import React from "react";

const FallingAEffect = () => {
  const numberOfAs = 30;

  const randomPosition = () => ({
    left: `${Math.random() * 100}%`,
    animationDuration: `${5 + Math.random() * 5}s`,
    animationDelay: `${Math.random() * 5}s`,
    fontSize: `${20 + Math.random() * 30}px`,
  });

  const aElements = Array.from({ length: numberOfAs }).map((_, index) => (
    <span
      key={index}
      className="absolute text-[#FF6B6B] font-[Comfortaa] opacity-30 animate-fall"
      style={randomPosition()}
    >
      a
    </span>
  ));

  return (
    <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
      {aElements}
    </div>
  );
};

export default FallingAEffect;
