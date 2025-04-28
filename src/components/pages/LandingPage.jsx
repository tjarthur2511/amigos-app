import React from "react";
import { useNavigate } from "react-router-dom";
import FallingAEffect from "./FallingAEffect";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/signup");
  };

  return (
    <div className="relative text-center min-h-screen flex flex-col justify-center items-center bg-white overflow-hidden p-4">
      <FallingAEffect />

      <div className="relative z-10">
        <h1 className="text-6xl md:text-8xl font-bold text-[#FF6B6B] font-[Comfortaa] mb-4 amigo-text">
          <span className="flex items-center justify-center">
            <span className="inline-block animate-pulse-a">a</span>migos
          </span>
        </h1>

        <p className="text-lg md:text-2xl text-gray-700 mb-8 font-[Comfortaa] max-w-md mx-auto">
          Real friends. Real adventures. Join the community built for real friendships, not just followers.
        </p>

        <button
          onClick={handleGetStarted}
          className="bg-[#FF6B6B] hover:bg-[#e15555] text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 font-[Comfortaa]"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
