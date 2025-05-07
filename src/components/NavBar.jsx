// src/components/NavBar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NavBar = () => {
  const { t } = useTranslation();

  return (
    <div style={navWrapper}>
      <div style={navStyle}>
        <NavLink to="/" style={tabStyle}>{t('home') || 'Home'}</NavLink>
        <NavLink to="/amigos" style={tabStyle}>{t('amigos') || 'Amigos'}</NavLink>
        <NavLink to="/grupos" style={tabStyle}>{t('grupos') || 'Grupos'}</NavLink>
        <NavLink to="/profile" style={tabStyle}>{t('profile') || 'Profile'}</NavLink>
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
  backgroundColor: 'white',
  padding: '0.8rem 1rem',
  borderRadius: '30px',
  boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
  display: 'flex',
  gap: '1rem',
};

const tabStyle = {
  backgroundColor: '#FF6B6B',
  color: 'white',
  border: 'none',
  padding: '12px 20px',
  borderRadius: '30px',
  fontSize: '1rem',
  fontWeight: 'bold',
  fontFamily: 'Comfortaa, sans-serif',
  cursor: 'pointer',
  textDecoration: 'none',
  boxShadow: '0 3px 8px rgba(0,0,0,0.2)',
};

export default NavBar;
