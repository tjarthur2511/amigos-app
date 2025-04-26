// src/components/pages/Home.jsx
import React from "react";
import { useTranslation } from "react-i18next";

const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
      <h1 className="text-4xl font-bold text-[#FF6B6B] mb-4">
        {t("home")}
      </h1>
      <p className="text-lg text-gray-600">
        {t("syncing")}
      </p>
    </div>
  );
};

export default Home;
