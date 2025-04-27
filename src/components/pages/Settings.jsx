import React from "react";
import { useTranslation } from "react-i18next";

const Settings = () => {
  const { t } = useTranslation();

  return (
    <div className="page-container">
      <h1>{t("settings")}</h1>
      <p>Customize your experience, language, and more.</p>
    </div>
  );
};

export default Settings;
