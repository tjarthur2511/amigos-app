import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { db, auth } from '../../firebase.js';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const [hasSkipped, setHasSkipped] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSkipped = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;
        const ref = doc(db, 'users', user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          const skipped = [];

          if (data.weeklyQuiz) {
            Object.values(data.weeklyQuiz).forEach((val) => {
              if (!val || val.trim() === '') skipped.push(val);
            });
          }

          if (data.monthlyQuiz) {
            Object.values(data.monthlyQuiz).forEach((val) => {
              if (!val || val.trim() === '') skipped.push(val);
            });
          }

          if (skipped.length > 0) setHasSkipped(true);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    checkSkipped();
  }, []);

  const goToSkipped = () => {
    navigate('/profile?tab=skipped');
  };

  if (loading) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <p>Loading your home feed...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-3xl md:text-4xl font-bold text-[#FF6B6B] mb-6">
        Welcome to Amigos 👋
      </h1>

      <p className="text-gray-700 mb-10">
        This is your home base. Here you’ll discover posts, new amigos, and upcoming meetups all in one feed.
      </p>

      {hasSkipped && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="w-full max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-lg mb-8"
        >
          <h2 className="text-2xl font-bold text-[#FF6B6B] mb-2 text-center">🌱 You have unanswered quiz questions!</h2>
          <p className="text-center text-gray-700 mb-4">
            Finishing them helps Amigos match you even better!
          </p>
          <div className="flex justify-center">
            <button
              onClick={goToSkipped}
              className="px-6 py-3 bg-[#FF6B6B] text-white rounded-xl hover:bg-[#e15555] transition"
            >
              Complete Now
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default HomePage;
