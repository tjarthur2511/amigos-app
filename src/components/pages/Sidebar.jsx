// src/components/Sidebar.js
import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";
import { useTranslation } from "react-i18next";

const Sidebar = () => {
  const { t } = useTranslation();

  return (
    <div className="sidebar">
      <NavLink to="/" end>
        {t("home")}
      </NavLink>
      <NavLink to="/profile">{t("profile")}</NavLink>
      <NavLink to="/amigos">{t("amigos")}</NavLink>
      <NavLink to="/grupos">{t("grupos")}</NavLink>
      <NavLink to="/admin">{t("admin")}</NavLink>
    </div>
  );
};

export default Sidebar;
