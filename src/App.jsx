// src/App.jsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, onSnapshot } from 'firebase/firestore';

import LoadingScreen from './components/LoadingScreen';
import ScrollToTop from './components/common/ScrollToTop';
import FallingAEffect from './components/common/FallingAEffect';

import SignOutButton from './components/common/SignOutButton';
import NewPostButton from './components/common/NewPostButton';
import NotificationsBell from './components/common/NotificationsBell';
import GoLiveButton from './components/common/GoLiveButton';
import MapHangoutButton from './components/common/MapHangoutButton';
import GlobalSearch from './components/common/GlobalSearch';
import HelpButton from './components/common/HelpButton';

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

function AppContent({ user, themeColor, textColor }) {
  const location = useLocation();
  const hideNavOnPaths = ['/'];
  const showNav = user && !hideNavOnPaths.includes(location.pathname);

  return (
    <div
      style={{
        backgroundColor: themeColor || '#FF6B6B',
        color: textColor || '#FFFFFF',
        minHeight: '100vh',
        position: 'relative',
        overflowX: 'hidden',
      }}
    >
      {/* 🔴 Global Coral Background */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: themeColor || '#FF6B6B',
        zIndex: -5000,
      }} />

      {/* 🔴 Falling Amigos Animation */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1000,
        pointerEvents: 'none'
      }}>
        <FallingAEffect />
      </div>

      <ScrollToTop />

      {user && (
        <>
          <SignOutButton />
          <NewPostButton />
          <NotificationsBell />
          <GoLiveButton />
          <MapHangoutButton />
          <GlobalSearch />
          <HelpButton />
        </>
      )}

      <div className="relative z-10">
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
    </div>
  );
}

function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [themeColor, setThemeColor] = useState("#FF6B6B");
  const [textColor, setTextColor] = useState("#FFFFFF");

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const unsubscribeTheme = onSnapshot(userRef, (docSnap) => {
          const data = docSnap.data();
          if (data?.themeColor) setThemeColor(data.themeColor);
          if (data?.textColor) setTextColor(data.textColor);
        });

        return () => unsubscribeTheme();
      }
    });

    return () => unsubscribeAuth();
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <Router>
      <AppContent user={user} themeColor={themeColor} textColor={textColor} />
    </Router>
  );
}

export default App;
