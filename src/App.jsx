// src/App.jsx
import React, { useEffect, useState, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

// Pages and Components
import LoadingScreen from './components/LoadingScreen';
import NavBar from './components/NavBar';
import ScrollToTop from './components/common/ScrollToTop.jsx';

// Lazy load pages
const HomePage = React.lazy(() => import('./components/pages/HomePage'));
const LoginPage = React.lazy(() => import('./components/pages/LoginPage'));
const SignUpPage = React.lazy(() => import('./components/pages/SignUpPage'));
const AdminPanel = React.lazy(() => import('./components/pages/Admin/AdminPanel'));
const SetupQuizPage = React.lazy(() => import('./components/pages/SetupQuizPage'));
const MonthlyQuizPage = React.lazy(() => import('./components/pages/MonthlyQuizPage'));
const WeeklyQuizPage = React.lazy(() => import('./components/pages/WeeklyQuizPage.jsx'));
const ProfilePage = React.lazy(() => import('./components/pages/ProfilePage/ProfilePage.jsx'));
const GruposPage = React.lazy(() => import('./components/pages/Grupos/GruposPage.jsx'));
const AmigosPage = React.lazy(() => import('./components/pages/Amigos/AmigosPage.jsx'));
const LivePage = React.lazy(() => import('./components/pages/Live/LivePage.jsx'));
const LandingPage = React.lazy(() => import('./components/pages/LandingPage.jsx'));

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
      <ScrollToTop />
      <Suspense fallback={<LoadingScreen />}>
        {user && <NavBar />}
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
              <Route path="/weekly-quiz" element={<WeeklyQuizPage />} />
              <Route path="/profile/admin" element={<AdminPanel />} />
              <Route path="*" element={<Navigate to="/" />} /> {/* Redirect to home if route not found */}
            </>
          ) : (
            <>
              <Route path="/" element={<LandingPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="*" element={<Navigate to="/" />} /> {/* Redirect to landing if route not found */}
            </>
          )}
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
