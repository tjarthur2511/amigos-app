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
        />
      </div>
      <div className="bg-white px-4 py-2 rounded-full shadow-md flex gap-4">
        {links.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `px-5 py-2 rounded-full text-base font-comfortaa font-bold transition-all duration-200 ease-in-out no-underline ` +
              (isActive
                ? 'bg-coral-dark text-white shadow-lg' // Active state
                : 'bg-coral text-white shadow-md hover:bg-coral-dark') // Default non-active state
            }
            style={ to === '/' ? { border: 'none !important', padding: '0.5rem 1.25rem !important' } : {} } // Temporary debug style for 'Home' link
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
