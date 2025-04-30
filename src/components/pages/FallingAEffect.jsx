import React, { useEffect, useState } from "react";

const FallingAEffect = () => {
  const [aElements, setAElements] = useState([]);

  useEffect(() => {
    const generateElements = () => {
      const elements = [];
      for (let i = 0; i < 30; i++) {
        const size = Math.random() * 40 + 10; // 10px to 50px
        const left = Math.random() * 100; // percentage
        const delay = Math.random() * 5; // seconds
        const duration = Math.random() * 10 + 5; // seconds
        const opacity = Math.random() * 0.6 + 0.2;

        elements.push(
          <img
            key={i}
            src="/assets/amigosaonly.png"
            style={{
              position: "absolute",
              top: "-50px",
              left: `${left}%`,
              width: `${size}px`,
              height: `${size}px`,
              opacity: opacity,
              animation: `fallingA ${duration}s linear ${delay}s infinite`,
              pointerEvents: "none",
              zIndex: -10,
              userSelect: "none"
            }}
            draggable={false}
          />
        );
      }
      setAElements(elements);
    };

    generateElements();
  }, []);

  return (
    <div style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      zIndex: -10,
      overflow: "hidden",
      pointerEvents: "none"
    }}>
      <style>{`
        @keyframes fallingA {
          0% { transform: translateY(-100px) rotate(0deg); }
          100% { transform: translateY(120vh) rotate(360deg); }
        }
      `}</style>
      {aElements}
    </div>
  );
};

export default FallingAEffect;
