// src/components/Navbar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Navbar.css';

const Navbar = () => {
  const { t } = useTranslation();

  return (
    <nav className="navbar">
      <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
        {t('home')}
      </NavLink>
      <NavLink to="/profile" className={({ isActive }) => (isActive ? "active" : "")}>
        {t('profile')}
      </NavLink>
      <NavLink to="/amigos" className={({ isActive }) => (isActive ? "active" : "")}>
        {t('amigos')}
      </NavLink>
      <NavLink to="/grupos" className={({ isActive }) => (isActive ? "active" : "")}>
        {t('grupos')}
      </NavLink>
      <NavLink to="/profile/admin" className={({ isActive }) => (isActive ? "active" : "")}>
        {t('admin')}
      </NavLink>
    </nav>
  );
};

export default Navbar;
