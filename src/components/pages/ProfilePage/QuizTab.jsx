// src/components/pages/ProfilePage/QuizTab.jsx
import React, { useEffect, useState, useRef } from 'react';
import { db, auth } from '../../../firebase.js';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';

const QuizTab = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('onboarding');
  const [editing, setEditing] = useState({});
  const [editedAnswers, setEditedAnswers] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const ref = doc(db, 'users', user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setUserData(snap.data());
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const handleEdit = (key, currentAnswer) => {
    setEditing((prev) => ({ ...prev, [key]: true }));
    setEditedAnswers((prev) => ({ ...prev, [key]: currentAnswer }));
  };

  const handleSave = async (key, prefix) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const fieldToUpdate = prefix === 'q' ? 'quizAnswers' : prefix === 'mq' ? 'monthlyQuiz' : 'weeklyQuiz';

        await updateDoc(userRef, {
          [`${fieldToUpdate}.${key}`]: editedAnswers[key]
        });

        // Update local UI
        setUserData((prev) => ({
          ...prev,
          [fieldToUpdate]: {
            ...prev[fieldToUpdate],
            [key]: editedAnswers[key]
          }
        }));

        setEditing((prev) => ({ ...prev, [key]: false }));
      }
    } catch (error) {
      console.error('Failed to save edited answer', error);
    }
  };

  const renderAnswers = (answers, prefix) => {
    return Object.entries(answers || {})
      .filter(([key]) => key.startsWith(prefix))
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => (
        <motion.div
          key={key}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="p-4 border rounded-lg shadow-md bg-white mb-4"
        >
          <h4 className="font-bold text-[#FF6B6B]">{key.toUpperCase()}</h4>
          {editing[key] ? (
            <div className="flex flex-col mt-2">
              <input
                type="text"
                value={editedAnswers[key]}
                onChange={(e) =>
                  setEditedAnswers((prev) => ({ ...prev, [key]: e.target.value }))
                }
                className="w-full p-2 border rounded-lg"
              />
              <button
                onClick={() => handleSave(key, prefix)}
                className="mt-2 bg-[#FF6B6B] text-white py-2 rounded-lg hover:bg-[#e15555] transition"
              >
                Save
              </button>
            </div>
          ) : (
            <div className="flex flex-col">
              <p className="text-gray-700 mt-2">{value}</p>
              <button
                onClick={() => handleEdit(key, value)}
                className="mt-2 text-[#FF6B6B] text-sm underline hover:text-[#e15555] transition"
              >
                Edit
              </button>
            </div>
          )}
        </motion.div>
      ));
  };

  const renderSkippedQuestions = () => {
    const skipped = [];

    if (userData?.weeklyQuiz) {
      Object.entries(userData.weeklyQuiz).forEach(([key, value]) => {
        if (!value || value.trim() === '') {
          skipped.push({ key, type: 'weekly' });
        }
      });
    }

    if (userData?.monthlyQuiz) {
      Object.entries(userData.monthlyQuiz).forEach(([key, value]) => {
        if (!value || value.trim() === '') {
          skipped.push({ key, type: 'monthly' });
        }
      });
    }

    if (skipped.length === 0) return <p className="text-gray-600">No unanswered questions! 🎉</p>;

    return (
      <div className="flex flex-col space-y-4">
        {skipped.map(({ key, type }) => (
          <motion.div
            key={key}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="p-4 border rounded-lg shadow-md bg-white"
          >
            <h4 className="font-bold text-[#FF6B6B]">{key.toUpperCase()} (Skipped)</h4>
            <input
              type="text"
              value={editedAnswers[key] || ''}
              onChange={(e) =>
                setEditedAnswers((prev) => ({ ...prev, [key]: e.target.value }))
              }
              className="w-full p-2 border rounded-lg mt-2"
            />
            <button
              onClick={() => handleSave(key, type === 'monthly' ? 'mq' : 'wq')}
              className="mt-2 bg-[#FF6B6B] text-white py-2 rounded-lg hover:bg-[#e15555] transition"
            >
              Save Answer
            </button>
          </motion.div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-40">
        <p className="text-[#FF6B6B] text-xl font-semibold">Loading quizzes...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-6">
      <h2 className="text-3xl font-bold text-[#FF6B6B]">Your Quiz History</h2>

      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded-full font-semibold ${
            activeTab === 'onboarding'
              ? 'bg-[#FF6B6B] text-white'
              : 'bg-white text-[#FF6B6B] border border-[#FF6B6B]'
          }`}
          onClick={() => setActiveTab('onboarding')}
        >
          Onboarding
        </button>
        <button
          className={`px-4 py-2 rounded-full font-semibold ${
            activeTab === 'monthly'
              ? 'bg-[#FF6B6B] text-white'
              : 'bg-white text-[#FF6B6B] border border-[#FF6B6B]'
          }`}
          onClick={() => setActiveTab('monthly')}
        >
          Monthly
        </button>
        <button
          className={`px-4 py-2 rounded-full font-semibold ${
            activeTab === 'weekly'
              ? 'bg-[#FF6B6B] text-white'
              : 'bg-white text-[#FF6B6B] border border-[#FF6B6B]'
          }`}
          onClick={() => setActiveTab('weekly')}
        >
          Weekly
        </button>
        <button
          className={`px-4 py-2 rounded-full font-semibold ${
            activeTab === 'skipped'
              ? 'bg-[#FF6B6B] text-white'
              : 'bg-white text-[#FF6B6B] border border-[#FF6B6B]'
          }`}
          onClick={() => setActiveTab('skipped')}
        >
          Answer Skipped
        </button>
      </div>

      <div className="w-full max-w-3xl px-4">
        {activeTab === 'onboarding' && renderAnswers(userData?.quizAnswers, 'q')}
        {activeTab === 'monthly' && renderAnswers(userData?.monthlyQuiz, 'mq')}
        {activeTab === 'weekly' && renderAnswers(userData?.weeklyQuiz, 'wq')}
        {activeTab === 'skipped' && (
          <>
            <h3 className="text-2xl text-center font-semibold text-[#FF6B6B] mb-4">
              Sometimes People Change 🌱
            </h3>
            {renderSkippedQuestions()}
          </>
        )}
      </div>
    </div>
  );
};

export default QuizTab;
