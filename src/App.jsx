// src/App.jsx
import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

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
import TestFirestoreWrite from './components/pages/Admin/TestFirestoreWrite';
import TestStorageUpload from './components/pages/Admin/TestStorageUpload';
import SetupQuizPage from './components/pages/SetupQuizPage';
import MonthlyQuizPage from './components/pages/MonthlyQuizPage';
import ProfilePage from './components/pages/ProfilePage/ProfilePage';
import PublicProfilePage from './components/pages/ProfilePage/PublicProfilePage';
import GruposPage from './components/pages/Grupos/GruposPage';
import PublicGrupoPage from './components/pages/Grupos/PublicGrupoPage';
import AmigosPage from './components/pages/Amigos/AmigosPage';
import ExploreAmigosPage from './components/pages/Amigos/ExploreAmigosPage';
import Explore from './components/pages/Explore';
import LivePage from './components/pages/Live/LivePage';
import TailwindTest from './components/pages/TailwindTest';
import DevChecklist from './components/pages/DevChecklist';

function AppContent({ user }) {
  const location = useLocation();
  const hideNavOnPaths = ['/login', '/signup'];
  const showNav = user && !hideNavOnPaths.includes(location.pathname);

  return (
    <div
      className="min-h-screen relative overflow-x-hidden font-comfortaa z-0" // Applied Tailwind classes
    >
      {/* 🔴 Background */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'var(--theme-color)',
          zIndex: -1000,
        }}
      />

      {/* 🅰️ Falling A's */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: -500,
          pointerEvents: 'none',
        }}
      >
        <FallingAEffect />
      </div>

      <ScrollToTop />

      {/* ✅ Only mount these when user is confirmed */}
      {showNav && user && (
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
              <Route path="/profile/:userId" element={<PublicProfilePage />} />
              <Route path="/grupos" element={<GruposPage />} />
              <Route path="/grupos/:grupoId" element={<PublicGrupoPage />} />
              <Route path="/amigos" element={<AmigosPage />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/explore-amigos" element={<ExploreAmigosPage />} />
              <Route path="/live" element={<LivePage />} />
              <Route path="/setup" element={<SetupQuizPage />} />
              <Route path="/monthly-quiz" element={<MonthlyQuizPage />} />
              <Route path="/profile/admin" element={<AdminPanel />} />
              <Route path="/test-firestore-write" element={<TestFirestoreWrite />} />
              <Route path="/test-storage-upload" element={<TestStorageUpload />} />
              <Route path="/tailwind-test" element={<TailwindTest />} />
              <Route path="/dev-checklist" element={<DevChecklist />} />
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
