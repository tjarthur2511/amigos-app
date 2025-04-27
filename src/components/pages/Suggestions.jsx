import React from "react";
import { useTranslation } from "react-i18next";

const Suggestions = () => {
  const { t } = useTranslation();

  return (
    <div className="suggestions-page">
      <h2>{t("suggestions")}</h2>
      <p>🤖 {t("syncing")}</p>
      <p>Stay tuned... personalized amigos and Grupos are coming soon!</p>
    </div>
  );
};

export default Suggestions;
