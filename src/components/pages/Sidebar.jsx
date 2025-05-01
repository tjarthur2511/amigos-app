// src/components/Sidebar.js
import React from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Sidebar = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col space-y-4 p-6 bg-white text-[#333] shadow-lg font-[Comfortaa] min-h-screen w-48">
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          isActive
            ? "text-[#FF6B6B] font-bold underline"
            : "hover:text-[#FF6B6B] transition"
        }
      >
        {t("home")}
      </NavLink>
      <NavLink
        to="/profile"
        className={({ isActive }) =>
          isActive
            ? "text-[#FF6B6B] font-bold underline"
            : "hover:text-[#FF6B6B] transition"
        }
      >
        {t("profile")}
      </NavLink>
      <NavLink
        to="/amigos"
        className={({ isActive }) =>
          isActive
            ? "text-[#FF6B6B] font-bold underline"
            : "hover:text-[#FF6B6B] transition"
        }
      >
        {t("amigos")}
      </NavLink>
      <NavLink
        to="/grupos"
        className={({ isActive }) =>
          isActive
            ? "text-[#FF6B6B] font-bold underline"
            : "hover:text-[#FF6B6B] transition"
        }
      >
        {t("grupos")}
      </NavLink>
      <NavLink
        to="/admin"
        className={({ isActive }) =>
          isActive
            ? "text-[#FF6B6B] font-bold underline"
            : "hover:text-[#FF6B6B] transition"
        }
      >
        {t("admin")}
      </NavLink>
    </div>
  );
};

export default Sidebar;
