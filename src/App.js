// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Amigos from "./pages/Amigos";
import Grupos from "./pages/Grupos";
import Admin from "./pages/Admin";
import Navbar from "./components/Navbar";
import "./App.css";
import AmigosPage from "./pages/AmigosPage";
// ...
<Route path="/amigos" element={<AmigosPage />} />


function App() {
  const { t } = useTranslation();

  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/amigos" element={<Amigos />} />
          <Route path="/grupos" element={<Grupos />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
