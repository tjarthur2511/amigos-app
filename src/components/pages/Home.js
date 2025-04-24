import React from "react";
import { useTranslation } from "react-i18next";

const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="page-container">
      <h1>{t("home")}</h1>
      <p>{t("syncing")}</p>
    </div>
  );
};

export default Home;
