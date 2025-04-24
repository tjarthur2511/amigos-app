// src/components/pages/SignUpPage.jsx
import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase.js';
import { useNavigate } from 'react-router-dom';

const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updateProfile(user, { displayName });

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        displayName,
        email,
        createdAt: new Date().toISOString(),
        quizAnswers: {},
        monthlyQuiz: {},
        amigos: [],
        grupos: [],
        location: '',
        preferences: {}
      });

      navigate('/setup'); // go to quiz page after sign up
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <h1>Sign Up for Amigos</h1>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Display Name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
};

export default SignUpPage;
