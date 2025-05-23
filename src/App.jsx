// src/App.jsx
import React, { useEffect, useState, lazy, Suspense } from 'react';
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

// Lazy load page components
const LandingPage = lazy(() => import('./components/pages/LandingPage'));
const HomePage = lazy(() => import('./components/pages/HomePage'));
const LoginPage = lazy(() => import('./components/pages/LoginPage'));
const SignUpPage = lazy(() => import('./components/pages/SignUpPage'));
const AdminPanel = lazy(() => import('./components/pages/Admin/AdminPanel'));
const TestFirestoreWrite = lazy(() => import('./components/pages/Admin/TestFirestoreWrite'));
const TestStorageUpload = lazy(() => import('./components/pages/Admin/TestStorageUpload'));
const SetupQuizPage = lazy(() => import('./components/pages/SetupQuizPage'));
const MonthlyQuizPage = lazy(() => import('./components/pages/MonthlyQuizPage'));
const ProfilePage = lazy(() => import('./components/pages/ProfilePage/ProfilePage'));
const PublicProfilePage = lazy(() => import('./components/pages/ProfilePage/PublicProfilePage'));
const GruposPage = lazy(() => import('./components/pages/Grupos/GruposPage'));
const PublicGrupoPage = lazy(() => import('./components/pages/Grupos/PublicGrupoPage'));
const AmigosPage = lazy(() => import('./components/pages/Amigos/AmigosPage'));
const ExploreAmigosPage = lazy(() => import('./components/pages/Amigos/ExploreAmigosPage'));
const Explore = lazy(() => import('./components/pages/Explore'));
const LivePage = lazy(() => import('./components/pages/Live/LivePage'));
const TailwindTest = lazy(() => import('./components/pages/TailwindTest'));
const DevChecklist = lazy(() => import('./components/pages/DevChecklist'));

function AppContent({ user }) {
  const location = useLocation();
  const hideNavOnPaths = ['/login', '/signup'];
  const showNav = user && !hideNavOnPaths.includes(location.pathname);

  return (
    <div
      style={{
        minHeight: '100vh',
        position: 'relative',
        overflowX: 'hidden',
        fontFamily: 'Comfortaa, sans-serif',
        zIndex: 0,
      }}
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
        <Suspense fallback={<LoadingScreen />}>
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
        </Suspense>
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
