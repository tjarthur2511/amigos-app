import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import FallingAEffect from '../common/FallingAEffect';

const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [dob, setDob] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const ageDiff = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDiff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (calculateAge(dob) < 13) {
      setError('You must be at least 13 years old to join amigos.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName });

      await auth.currentUser?.reload();
      const user = auth.currentUser;

      if (!user) {
        setError('Authentication failed. Please try again.');
        return;
      }

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        displayName,
        email,
        dob,
        createdAt: serverTimestamp(),
        quizAnswers: {},
        monthlyQuiz: {},
        amigos: [],
        grupos: [],
        preferences: {},
        isAdmin: false,
      });

      navigate('/setup');
    } catch (err) {
      setError(err.message || 'Sign-up failed');
    }
  };

  return (
    <div style={{
      backgroundColor: "#FF6B6B",
      minHeight: "100vh",
      position: "relative",
      overflow: "hidden",
      width: "100%",
      fontFamily: "Comfortaa, sans-serif"
    }}>
      
      {/* ✅ Falling background fixed, works behind content */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none"
      }}>
        <FallingAEffect />
      </div>

      <div style={{
        zIndex: 5
      }}>
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "2rem",
          paddingTop: "4rem",
          paddingBottom: "4rem"
        }}>
          <div style={{
            backgroundColor: "white",
            padding: "2rem",
            borderRadius: "1rem",
            boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
            width: "90%",
            maxWidth: "500px",
            textAlign: "center"
          }}>
            <h2 style={{
              fontSize: "1.8rem",
              color: "#FF6B6B",
              marginBottom: "1rem",
              fontFamily: "sans-serif"
            }}>
              Join <span style={{ fontFamily: "'Comfortaa', sans-serif" }}>a</span>migos
            </h2>

            {error && (
              <div style={{
                backgroundColor: "#ffe6e6",
                color: "#cc0000",
                padding: "10px",
                borderRadius: "8px",
                marginBottom: "1rem",
                fontFamily: "Comfortaa, sans-serif",
                fontSize: "0.9rem"
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <input
                type="text"
                placeholder="Display Name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                style={inputStyle}
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={inputStyle}
              />
              <input
                type="password"
                placeholder="Password (6+ characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={inputStyle}
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={inputStyle}
              />
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                required
                style={inputStyle}
              />
              <button
                type="submit"
                style={{
                  backgroundColor: "#FF6B6B",
                  color: "white",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "30px",
                  fontSize: "1rem",
                  fontFamily: "Comfortaa, sans-serif",
                  cursor: "pointer",
                  transition: "background-color 0.3s ease"
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = "#e15555"}
                onMouseOut={(e) => e.target.style.backgroundColor = "#FF6B6B"}
              >
                Sign Up
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const inputStyle = {
  padding: "12px",
  border: "1px solid #ccc",
  borderRadius: "10px",
  fontFamily: "Comfortaa, sans-serif",
  fontSize: "1rem",
  outline: "none"
};

export default SignUpPage;
