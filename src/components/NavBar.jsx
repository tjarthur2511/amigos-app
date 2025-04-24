import React from 'react'
import './NavBar.css'
import { Link } from 'react-router-dom'

function NavBar() {
  return (
    <nav className="navbar">
      <Link to="/">Home</Link>
      <Link to="/profile">Profile</Link>
      <Link to="/grupos">Grupos</Link>
      <Link to="/amigos">Amigos</Link>
      <Link to="/live">Go Live</Link>
    </nav>
  )
}

export default NavBar
