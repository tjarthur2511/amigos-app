// ✅ Final NavBar.jsx with Tailwind, Theme Support, and Logo Integration
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NavBar = () => {
  const { t } = useTranslation();
  const [hovered, setHovered] = useState(null);

  const handleHover = (key) => setHovered(key);
  const handleLeave = () => setHovered(null);

  const links = [
    { to: '/', label: t('home') || 'Home' },
    { to: '/amigos', label: t('amigos') || 'Amigos' },
    { to: '/grupos', label: t('grupos') || 'Grupos' },
    { to: '/profile', label: t('profile') || 'Profile' },
  ];

  return (
    <div className="flex flex-col items-center justify-center mt-8 mb-8 z-10 relative">
      <div className="mb-4">
        <img
          src="/assets/amigoshangouts1.png"
          alt="amigos logo"
          className="h-32 w-auto animate-[pulse-a_1.75s_infinite]"
          loading="lazy"
        />
      </div>
      <div className="bg-white px-4 py-2 rounded-full shadow-md flex gap-4">
        {links.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `border border-coral px-5 py-2 rounded-full text-base font-bold font-comfortaa transition duration-200 no-underline shadow-md ` +
              (isActive
                ? 'bg-coral text-white'
                : 'bg-white text-coral hover:bg-coral hover:text-white')
            }
            onMouseEnter={() => handleHover(to)}
            onMouseLeave={handleLeave}
          >
            {label}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default NavBar;
