import React from 'react';
import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <nav className="navbar flex items-center justify-between px-6 py-3 bg-white shadow-md">
      <Link to="/" className="text-3xl font-bold flex items-center space-x-2">
        <span className="bg-[#FF6B6B] text-white rounded-full px-3 py-1 animate-pulse">
          a
        </span>
        <span className="text-gray-800">migos</span>
      </Link>

      <div className="flex items-center space-x-6 text-lg">
        <Link to="/">Home</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/grupos">Grupos</Link>
        <Link to="/amigos">Amigos</Link>
        <Link to="/live">Go Live</Link>
      </div>
    </nav>
  );
}

export default NavBar;
