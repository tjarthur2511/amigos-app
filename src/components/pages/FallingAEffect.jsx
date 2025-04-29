import React from "react";

const FallingAEffect = () => {
  const elements = Array.from({ length: 25 });

  return (
    <>
      {elements.map((_, i) => {
        const size = Math.floor(Math.random() * 40) + 20;
        const left = Math.random() * 100;
        const delay = Math.random() * 4;

        return (
          <img
            key={i}
            src="/assets/amigosaonly.png"
            alt="a"
            style={{
              position: "absolute",
              top: "-50px",
              left: `${left}%`,
              width: `${size}px`,
              opacity: 0.6,
              animation: `fall linear ${3 + Math.random() * 3}s infinite`,
              animationDelay: `${delay}s`,
              zIndex: 0,
              pointerEvents: "none",
            }}
          />
        );
      })}
    </>
  );
};

export default FallingAEffect;
