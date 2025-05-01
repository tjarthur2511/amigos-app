// src/components/LoadingScreen.jsx
import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FF6B6B] text-white font-[Comfortaa] p-6 text-center">
      {/* Spinning amigo 'a' */}
      <div className="text-7xl font-bold animate-spin mb-4">a</div>

      {/* Inspirational or funny quote */}
      <p className="max-w-xl text-lg leading-relaxed">
        “Amigos is more than just an app — it’s your new crew finder. Whether you're into hiking, coding, painting, or vibing to jazz at midnight, Amigos helps you find kindred spirits to share it with. Built by real people and powered by AI, it’s friendship — reimagined.”
      </p>
    </div>
  );
};

export default LoadingScreen;
