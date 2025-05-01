// src/components/pages/Suggestions.jsx
import React from "react";
import { useTranslation } from "react-i18next";

const Suggestions = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#FF6B6B] flex flex-col items-center justify-center text-white text-center p-6 font-[Comfortaa]">
      <h2 className="text-3xl font-bold mb-4">{t("suggestions")}</h2>
      <p className="text-lg mb-2">🤖 {t("syncing")}</p>
      <p className="text-md">Hang tight — personalized amigos and Grupos are coming soon!</p>
    </div>
  );
};

export default Suggestions;
