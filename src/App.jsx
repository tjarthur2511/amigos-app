// src/App.jsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

import LoadingScreen from './components/LoadingScreen';
import NavBar from './components/NavBar';
import HomePage from './components/pages/HomePage';
import LoginPage from './components/pages/LoginPage';
import SignUpPage from './components/pages/SignUpPage';
import AdminPanel from './components/pages/Admin/AdminPanel';
// import SetupQuizPage from './components/pages/SetupQuizPage'; (coming next)

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
      {user && <NavBar />}
      <Routes>
        {user ? (
          <>
            <Route path="/" element={<HomePage />} />
            <Route path="/profile/admin" element={<AdminPanel />} />
            {/* <Route path="/setup" element={<SetupQuizPage />} /> */}  {/* Placeholder for quiz */}
          </>
        ) : (
          <>
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="*" element={<LoginPage />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;