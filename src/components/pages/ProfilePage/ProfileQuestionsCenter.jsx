import React, { useEffect, useState } from 'react';
import { auth, db } from '../../../firebase';
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs
} from 'firebase/firestore';
import { motion } from 'framer-motion';

const ProfileQuestionsCenter = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [status, setStatus] = useState('');
  const [history, setHistory] = useState({ quizAnswers: {}, monthlyQuiz: {} });

  useEffect(() => {
    const fetchAll = async () => {
      const user = auth.currentUser;
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
              month: data.month || null
            });
          });
        }
      });

      setQuestions(allQs);
      setAnswers({ ...onboardingAnswers, ...monthlyAnswers });
    };

    fetchAll();
  }, []);

  const handleChange = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = async (id) => {
    const user = auth.currentUser;
    if (!user) return;

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
      setTimeout(() => setStatus(''), 2000);
    } catch (err) {
      console.error(err);
      setStatus('Failed to save.');
    }
  };

  const renderHistory = (typeLabel, data) => (
    <div className="space-y-4 mt-6">
      <h3 className="text-xl font-bold text-[#FF6B6B] text-center">
        {typeLabel}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.entries(data).map(([key, val]) => (
          <div
            key={key}
            className="bg-white border border-[#FF6B6B] p-4 rounded-xl shadow hover:shadow-lg transition duration-200"
          >
            <p className="text-sm text-[#FF6B6B] font-semibold">{key}</p>
            <p className="text-gray-700 text-sm mt-1">{val}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#fffafa] font-[Comfortaa] p-6"
    >
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-3xl shadow-xl border border-[#ffe0e0]">
        <h2 className="text-2xl text-[#FF6B6B] font-bold mb-6 text-center">
          🌈 Your Question Center
        </h2>

        <div className="space-y-6">
          {questions.map((q) => (
            <div key={q.id} className="bg-[#fff0f0] p-5 rounded-xl shadow-md border border-[#ff6b6b]">
              <p className="text-[#FF6B6B] font-semibold mb-2">{q.text}</p>
              <input
                type="text"
                value={answers[q.id] || ''}
                onChange={(e) => handleChange(q.id, e.target.value)}
                placeholder="Your answer..."
                className="w-full p-2 border border-[#FF6B6B] rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#ff6b6b]"
              />
              <button
                onClick={() => handleSave(q.id)}
                className="mt-2 bg-[#FF6B6B] text-white px-4 py-1 rounded-full hover:bg-[#e15555] transition duration-150"
              >
                Save
              </button>
            </div>
          ))}
        </div>

        {status && <p className="mt-4 text-center text-sm text-[#FF6B6B] animate-pulse">{status}</p>}

        <div className="mt-10">
          <h2 className="text-2xl text-[#FF6B6B] font-bold mb-4 text-center">
            📂 Your Answer Archives
          </h2>
          {renderHistory('🧠 Onboarding', history.quizAnswers)}
          {renderHistory('📆 Monthly', history.monthlyQuiz)}
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileQuestionsCenter;
