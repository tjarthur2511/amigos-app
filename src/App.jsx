import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

// Pages and Components
import LoadingScreen from './components/LoadingScreen';
import NavBar from './components/NavBar';
import ScrollToTop from './components/common/ScrollToTop';

import LandingPage from './components/pages/LandingPage';
import HomePage from './components/pages/HomePage';
import LoginPage from './components/pages/LoginPage';
import SignUpPage from './components/pages/SignUpPage';
import AdminPanel from './components/pages/Admin/AdminPanel';
import SetupQuizPage from './components/pages/SetupQuizPage';
import MonthlyQuizPage from './components/pages/MonthlyQuizPage';
import WeeklyQuizPage from './components/pages/WeeklyQuizPage';
import ProfilePage from './components/pages/ProfilePage/ProfilePage';
import GruposPage from './components/pages/Grupos/GruposPage';
import AmigosPage from './components/pages/Amigos/AmigosPage';
import LivePage from './components/pages/Live/LivePage';
import TailwindTest from './components/pages/TailwindTest';
<Route path="/tailwind-test" element={<TailwindTest />} />

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
      {user ? (
        <>
          <NavBar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/grupos" element={<GruposPage />} />
            <Route path="/amigos" element={<AmigosPage />} />
            <Route path="/live" element={<LivePage />} />
            <Route path="/setup" element={<SetupQuizPage />} />
            <Route path="/monthly-quiz" element={<MonthlyQuizPage />} />
            <Route path="/weekly-quiz" element={<WeeklyQuizPage />} />
            <Route path="/profile/admin" element={<AdminPanel />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </>
      ) : (
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
