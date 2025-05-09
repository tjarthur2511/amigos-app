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
    <div style={navWrapper}>
      <div style={navStyle}>
        {links.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            style={{
              ...tabStyle,
              backgroundColor: hovered === to ? '#FF6B6B' : '#FFFFFF',
              color: hovered === to ? '#FFFFFF' : '#FF6B6B',
              borderColor: '#FF6B6B',
            }}
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

const navWrapper = {
  display: 'flex',
  justifyContent: 'center',
  marginTop: '2rem',
  marginBottom: '2rem',
  zIndex: 5,
  position: 'relative',
};

const navStyle = {
  backgroundColor: '#FFFFFF',
  padding: '0.8rem 1rem',
  borderRadius: '30px',
  boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
  display: 'flex',
  gap: '1rem',
};

const tabStyle = {
  border: '1px solid #FF6B6B',
  padding: '12px 20px',
  borderRadius: '30px',
  fontSize: '1rem',
  fontWeight: 'bold',
  fontFamily: 'Comfortaa, sans-serif',
  cursor: 'pointer',
  textDecoration: 'none',
  boxShadow: '0 3px 8px rgba(0,0,0,0.1)',
  transition: 'all 0.2s ease-in-out',
};

export default NavBar;
