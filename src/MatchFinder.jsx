// src/components/MatchFinder.jsx
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // ✅ adjust path if needed
import { motion } from 'framer-motion'; // ✅ animations because Amigos

const MatchFinder = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const users = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMatches(users.slice(0, 5));
      } catch (err) {
        console.error('Failed to fetch matches:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-20">
        <p>Loading suggested amigos...</p>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-20">
        <p>No amigos found yet! 🌱</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full p-6 bg-white rounded-2xl shadow-lg">
      <h3 className="text-2xl font-bold text-[#FF6B6B] mb-6">Suggested Amigos</h3>
      <ul className="w-full space-y-4">
        {matches.map(user => (
          <motion.li
            key={user.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col p-4 bg-gray-50 rounded-xl shadow hover:shadow-md transition"
          >
            <p className="font-semibold text-lg text-[#FF6B6B]">{user.displayName || 'Unnamed Amigo'}</p>
            <p className="text-gray-600 text-sm mt-1">
              {user.quizAnswers?.q2 || 'No hobby shared yet'}
            </p>
          </motion.li>
        ))}
      </ul>

      <button
        className="mt-6 px-6 py-3 bg-[#FF6B6B] text-white rounded-xl hover:bg-[#e15555] transition"
      >
        Find More Amigos
      </button>
    </div>
  );
};

export default MatchFinder;
