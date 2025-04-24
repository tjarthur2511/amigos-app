import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './styles/App.css'
import NavBar from './components/NavBar'
import HomePage from './pages/HomePage'
import ProfilePage from './pages/ProfilePage'
import GruposPage from './pages/GruposPage'
import AmigosPage from './pages/AmigosPage'
import LivePage from './pages/LivePage'

function App() {
  return (
    <Router>
      <div className="app-container">
        <h1 className="amigos-logo">amigos</h1>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/grupos" element={<GruposPage />} />
          <Route path="/amigos" element={<AmigosPage />} />
          <Route path="/live" element={<LivePage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
