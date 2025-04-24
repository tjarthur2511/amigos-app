import React from "react";
import { useTranslation } from "react-i18next";

const Feed = () => {
  const { t } = useTranslation();

  return (
    <div className="page-container">
      <h1>{t("feed")}</h1>
      <p>This is your personalized amigo feed 📰</p>
    </div>
  );
};

export default Feed;
