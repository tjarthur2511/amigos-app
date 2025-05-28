import React, { useEffect, useState } from 'react';
import { auth, db } from '../../../firebase';
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { motion } from 'framer-motion';

const ProfileQuestionsCenter = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [history, setHistory] = useState({ quizAnswers: {}, monthlyQuiz: {} });
  const [edited, setEdited] = useState({});
  const [status, setStatus] = useState('');
  const [filter, setFilter] = useState('onboarding');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.exists() ? userSnap.data() : {};

      const onboardingAnswers = userData.quizAnswers || {};
      const monthlyAnswers = userData.monthlyQuiz || {};
      setHistory({ quizAnswers: onboardingAnswers, monthlyQuiz: monthlyAnswers });

      const qSnapshot = await getDocs(collection(db, 'questionSets'));
      const allQs = [];

      qSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.questions && data.questions.length > 0) {
          const prefix = data.type === 'monthly' ? 'mq' : 'q';
          data.questions.forEach((qText, index) => {
            allQs.push({
              id: `${prefix}${index + 1}`,
              text: qText,
              type: data.type,
              month: data.month || null,
            });
          });
        }
      });

      setQuestions(allQs);
      setAnswers({ ...onboardingAnswers, ...monthlyAnswers });
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
    setEdited((prev) => ({ ...prev, [id]: true }));
  };

  const handleSave = async (id) => {
    const user = auth.currentUser;
    if (!user || !answers[id]?.trim()) return;

    const userRef = doc(db, 'users', user.uid);
    const updateField = id.startsWith('mq') ? 'monthlyQuiz' : 'quizAnswers';

    try {
      await updateDoc(userRef, {
        [updateField]: {
          ...history[updateField],
          [id]: answers[id]
        }
      });
      setStatus(`Saved: ${id}`);
      setEdited((prev) => ({ ...prev, [id]: false }));
      setTimeout(() => setStatus(''), 2000);
    } catch (err) {
      console.error(err);
      setStatus('Failed to save.');
    }
  };

  const getFilteredQuestions = () => {
    if (filter === 'onboarding') {
      return questions.filter((q) => q.type !== 'monthly');
    }
    if (filter === 'monthly') {
      return questions.filter((q) => q.type === 'monthly');
    }
    if (filter === 'unanswered') {
      return questions.filter((q) => !answers[q.id]?.trim());
    }
    return questions;
  };

  const filteredQuestions = getFilteredQuestions();
  const progress = filteredQuestions.filter((q) => answers[q.id]?.trim()).length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-blush font-comfortaa p-6" // Used bg-blush and font-comfortaa
    >
      <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-blush"> {/* Used border-blush */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl text-coral font-bold"> {/* Used text-coral */}
            🌈 Your Question Center
          </h2>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-blush text-coral font-semibold border border-coral rounded-xl p-2" // Used bg-blush, text-coral, border-coral
          >
            <option value="onboarding">Onboarding</option>
            <option value="monthly">Monthly</option>
            <option value="unanswered">Unanswered</option>
          </select>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Progress: {progress} of {filteredQuestions.length} answered
        </p>

        <div className="space-y-6">
          {filteredQuestions.map((q) => {
            const isAnswered = !!answers[q.id]?.trim();

            return (
              <div key={q.id} className="flex flex-col items-start space-y-3 mb-6">
                {/* 💬 Android-style bubble */}
                <div className="bg-blush text-coral px-4 py-3 rounded-2xl shadow-md max-w-[90%]"> {/* Used bg-blush, text-coral */}
                  <p className="font-semibold">{q.text}</p>
                  {q.month && (
                    <span className="text-xs text-gray-500 block mt-1">
                      📅 {q.month}
                    </span>
                  )}
                  {isAnswered && (
                    <span className="text-xs bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full inline-block mt-2">
                      ✅ Completed
                    </span>
                  )}
                </div>

                {/* 📝 Answer input */}
                <input
                  type="text"
                  value={answers[q.id] || ''}
                  onChange={(e) => handleChange(q.id, e.target.value)}
                  placeholder="Type your answer..."
                  className="w-full sm:w-3/4 p-3 border border-coral rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-coral" // Used border-coral and focus:ring-coral
                />

                {/* 💾 Buttons */}
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleSave(q.id)}
                    disabled={!edited[q.id] || !answers[q.id]?.trim()}
                    className={`px-4 py-2 rounded-full transition duration-150 text-sm ${
                      !edited[q.id] || !answers[q.id]?.trim()
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-coral text-white hover:bg-coral-dark' // Used bg-coral and hover:bg-coral-dark
                    }`}
                  >
                    Save
                  </button>

                  <button
                    onClick={() => handleChange(q.id, "")}
                    className="px-4 py-2 rounded-full bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition text-sm"
                  >
                    Skip
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {status && (
          <p className="mt-6 text-center text-sm text-coral animate-pulse"> {/* Used text-coral */}
            {status}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default ProfileQuestionsCenter;
