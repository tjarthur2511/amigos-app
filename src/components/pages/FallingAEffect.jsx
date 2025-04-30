import React from "react";

const FallingAEffect = () => {
  const elements = Array.from({ length: 25 });

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {elements.map((_, i) => {
        const size = Math.floor(Math.random() * 40) + 20;
        const left = Math.random() * 100;
        const delay = Math.random() * 5;
        const duration = 4 + Math.random() * 3;

        return (
          <img
            key={i}
            src="/amigosaonly.png"
            alt="a"
            className="absolute animate-fall"
            style={{
              top: `-50px`,
              left: `${left}%`,
              width: `${size}px`,
              height: "auto",
              opacity: 0.6,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
            }}
          />
        );
      })}
    </div>
  );
};

export default FallingAEffect;
