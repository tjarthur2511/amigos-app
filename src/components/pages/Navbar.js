// src/components/Navbar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Navbar.css';

const Navbar = () => {
  const { t } = useTranslation();

  return (
    <nav className="navbar">
      <NavLink to="/" exact="true" activeclassname="active">{t('home')}</NavLink>
      <NavLink to="/profile" activeclassname="active">{t('profile')}</NavLink>
      <NavLink to="/amigos" activeclassname="active">{t('amigos')}</NavLink>
      <NavLink to="/grupos" activeclassname="active">{t('grupos')}</NavLink>
      <NavLink to="/admin" activeclassname="active">{t('admin')}</NavLink>
    </nav>
  );
};

export default Navbar;
