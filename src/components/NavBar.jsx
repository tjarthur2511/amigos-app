import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NavBar = () => {
  const { t } = useTranslation();

  return (
    <nav className="navbar z-0 flex items-center justify-between px-6 py-3 bg-white shadow-md">
      {/* Left-side logo */}
      <NavLink to="/" className="text-3xl font-bold flex items-center space-x-2">
        <span className="bg-[#FF6B6B] text-white rounded-full px-3 py-1 animate-pulse">a</span>
        <span className="text-gray-800">migos</span>
      </NavLink>

      {/* Right-side navigation links */}
      <div className="flex items-center space-x-6 text-lg">
        <NavLink to="/">{t('home')}</NavLink>
        <NavLink to="/profile">{t('profile')}</NavLink>
        <NavLink to="/grupos">{t('grupos')}</NavLink>
        <NavLink to="/amigos">{t('amigos')}</NavLink>
        <NavLink to="/map-hangouts">Map Hangouts</NavLink>
        <NavLink to="/live">Go Live</NavLink>
      </div>
    </nav>
  );
};

export default NavBar;
