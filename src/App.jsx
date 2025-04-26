// src/App.jsx
import React, { useEffect, useState, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

// Pages and Components
import LoadingScreen from './components/LoadingScreen';
import NavBar from './components/NavBar';
import HomePage from './components/pages/HomePage';
import LoginPage from './components/pages/LoginPage';
import SignUpPage from './components/pages/SignUpPage';
import AdminPanel from './components/pages/Admin/AdminPanel';
import SetupQuizPage from './components/pages/SetupQuizPage';
import MonthlyQuizPage from './components/pages/MonthlyQuizPage';
import WeeklyQuizPage from './components/pages/WeeklyQuizPage.jsx';
import ProfilePage from './components/pages/ProfilePage/ProfilePage.jsx';
import GruposPage from './components/pages/Grupos/GruposPage.jsx';
import AmigosPage from './components/pages/Amigos/AmigosPage.jsx';
import LivePage from './components/pages/Live/LivePage.jsx';
import LandingPage from './components/pages/LandingPage.jsx';
import ScrollToTop from './components/common/ScrollToTop.jsx'; // ✅ we'll make this next

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
            </>
          ) : (
            <>
              <Route path="/" element={<LandingPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="*" element={<LoginPage />} />
            </>
          )}
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
