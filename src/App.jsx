// src/App.jsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

// Pages and Components
import LoadingScreen from './components/LoadingScreen';
import NavBar from './components/NavBar';
import ScrollToTop from './components/common/ScrollToTop';
import FallingAEffect from './components/common/FallingAEffect';

import SignOutButton from './components/common/SignOutButton';
import NewPostButton from './components/common/NewPostButton'; // ✅ Restored
import NotificationsBell from './components/common/NotificationsBell';
import GoLiveButton from './components/common/GoLiveButton';
import ThemeToggle from './components/common/ThemeToggle';
import LanguageToggle from './components/common/LanguageToggle';
import GlobalSearch from './components/common/GlobalSearch';
import HelpButton from './components/common/HelpButton';
import ProfileMenu from './components/common/ProfileMenu';

import LandingPage from './components/pages/LandingPage';
import HomePage from './components/pages/HomePage';
import LoginPage from './components/pages/LoginPage';
import SignUpPage from './components/pages/SignUpPage';
import AdminPanel from './components/pages/Admin/AdminPanel';
import SetupQuizPage from './components/pages/SetupQuizPage';
import MonthlyQuizPage from './components/pages/MonthlyQuizPage';
import ProfilePage from './components/pages/ProfilePage/ProfilePage';
import GruposPage from './components/pages/Grupos/GruposPage';
import AmigosPage from './components/pages/Amigos/AmigosPage';
import LivePage from './components/pages/Live/LivePage';
import TailwindTest from './components/pages/TailwindTest';

function AppContent({ user }) {
  const location = useLocation();
  const hideNavOnPaths = ['/'];
  const showNav = user && !hideNavOnPaths.includes(location.pathname);

  return (
    <>
      <ScrollToTop />
      <FallingAEffect />

      {user && (
        <>
          <SignOutButton />
          <NewPostButton /> {/* ✅ Button restored correctly */}
          <NotificationsBell />
          <GoLiveButton />
          <ThemeToggle />
          <LanguageToggle />
          <GlobalSearch />
          <HelpButton />
          <ProfileMenu />
        </>
      )}

      <div className="relative z-10">
        {showNav && <NavBar />}
        <Routes>
          {user ? (
            <>
              <Route path="/" element={<HomePage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/grupos" element={<GruposPage />} />
              <Route path="/amigos" element={<AmigosPage />} />
              <Route path="/live" element={<LivePage />} />
              <Route path="/setup" element={<SetupQuizPage />} />
              <Route path="/monthly-quiz" element={<MonthlyQuizPage />} />
              <Route path="/profile/admin" element={<AdminPanel />} />
              <Route path="/tailwind-test" element={<TailwindTest />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          ) : (
            <>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}
        </Routes>
      </div>
    </>
  );
}

function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <Router>
      <AppContent user={user} />
    </Router>
  );
}

export default App;
