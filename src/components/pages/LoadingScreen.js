// src/components/LoadingScreen.js
import React from "react";
import "./LoadingScreen.css";
import { useTranslation } from "react-i18next";

const LoadingScreen = () => {
  const { t } = useTranslation();

  const puns = [
    t("syncing"), // This will use the translated version
    "Spinning up the vibes 🌪️",
    "Gathering amigos from the cloud ☁️",
    "Charging up the group chat ⚡",
    "Polishing your profile ✨",
    "Loading smiles 😄",
    "Summoning your squad 🧙‍♂️"
  ];

  const randomPun = puns[Math.floor(Math.random() * puns.length)];

  return (
    <div className="loading-screen">
      <div className="loading-logo">a</div>
      <p>{randomPun}</p>
    </div>
  );
};

export default LoadingScreen;
