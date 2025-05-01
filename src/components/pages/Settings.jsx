// src/components/pages/Settings.jsx
import React from "react";
import { useTranslation } from "react-i18next";

const Settings = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#FF6B6B] flex flex-col items-center justify-center p-6 text-white font-[Comfortaa] text-center">
      <h1 className="text-3xl font-bold mb-4">{t("settings")}</h1>
      <p className="text-lg">Customize your experience, language, and more.</p>
    </div>
  );
};

export default Settings;
