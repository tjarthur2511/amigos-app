// src/components/LoadingScreen.jsx
import React from "react";
import "./LoadingScreen.css";
import { useTranslation } from "react-i18next";

const LoadingScreen = () => {
  const { t } = useTranslation();

  const puns = [
    t("syncing"), // ✅ translated "Syncing vibes…"
    "Spinning up the vibes 🌪️",
    "Gathering amigos from the cloud ☁️",
    "Charging up the group chat ⚡",
    "Polishing your profile ✨",
    "Loading smiles 😄",
    "Summoning your squad 🧙‍♂️",
    "Tuning your adventures 🎶",
    "Pairing you with partners-in-crime 🤝",
    "Launching your next memory 🚀"
  ];

  const randomPun = puns[Math.floor(Math.random() * puns.length)];

  return (
    <div className="loading-screen flex flex-col items-center justify-center min-h-screen bg-white text-[#FF6B6B] space-y-6">
      <div className="loading-logo text-8xl font-bold animate-bounce">
        a
      </div>
      <p className="text-lg font-semibold text-gray-600 text-center">
        {randomPun}
      </p>
    </div>
  );
};

export default LoadingScreen;
