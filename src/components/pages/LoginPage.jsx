// src/components/pages/LoginPage.jsx
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase.js';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import FallingAEffect from '../common/FallingAEffect'; // ✅ imported falling background

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/'); // ✅ send to home page on success
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col items-center justify-center min-h-screen p-6 bg-[#FF6B6B] relative overflow-hidden font-[Comfortaa]"
    >
      {/* ✅ background layer */}
      <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
        <FallingAEffect />
      </div>

      {/* ✅ login card foreground */}
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg z-10">
        <h1 className="text-3xl font-bold text-[#FF6B6B] mb-6 text-center">Login to Amigos</h1>

        <form onSubmit={handleLogin} className="flex flex-col space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-xl focus:border-[#FF6B6B] outline-none transition"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-xl focus:border-[#FF6B6B] outline-none transition"
          />
          <button
            type="submit"
            className="w-full bg-[#FF6B6B] text-white py-3 rounded-xl hover:bg-[#e15555] transition"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {error && (
          <p className="text-red-500 text-center text-sm mt-4">{error}</p>
        )}

        <p className="text-gray-600 text-center text-sm mt-6">
          Don’t have Amigos?{' '}
          <Link to="/signup" className="text-[#FF6B6B] hover:underline">
            Come find some
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default LoginPage;
