// src/components/pages/MonthlyQuizPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../../context/NotificationContext.jsx'; // Import useNotification
import { auth, db } from '../../firebase.js';
import { doc, updateDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { motion } from 'framer-motion';
import FallingAEffect from '../common/FallingAEffect';

const MonthlyQuizPage = () => {
  const { showNotification } = useNotification(); // Initialize useNotification
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const now = new Date();
        const monthString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        const q = query(
          collection(db, 'questionSets'),
          where('type', '==', 'monthly'),
          where('month', '==', monthString)
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const docData = snapshot.docs[0].data();
          setQuestions(docData.questions);
          setAnswers(Array(docData.questions.length).fill(''));
        } else {
          setError('No monthly questions available.');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load monthly questions.');
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const handleAnswer = (e) => {
    const updated = [...answers];
    updated[current] = e.target.value;
    setAnswers(updated);
  };

  const handleNext = async () => {
    const wordCount = answers[current]?.trim().split(/\s+/).length;
    if (wordCount < 3) {
      showNotification('Please write at least 3 words! Amigos love details 🌟', 'warning', 3000);
      return;
    }

    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      try {
        const user = auth.currentUser;
        if (user) {
          const userRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
            const currentMonthlyQuiz = docSnap.data().monthlyQuiz || {};
            const newAnswers = answers.reduce((acc, answer, index) => {
              if (answer.trim() !== '') {
                acc[`mq${index + 1}`] = answer;
              }
              return acc;
            }, {});

            await updateDoc(userRef, {
              monthlyQuiz: {
                ...currentMonthlyQuiz,
                ...newAnswers
              }
            });
          }
        }
        navigate('/');
      } catch (err) {
        console.error(err);
        setError('Failed to save your answers. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FF6B6B] text-white font-[Comfortaa]">
        <p>Loading monthly quiz...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FF6B6B] text-white font-[Comfortaa]">
        <p className="text-red-200 text-center">{error}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col items-center justify-center min-h-screen p-6 bg-[#FF6B6B] relative font-[Comfortaa] overflow-hidden"
    >
      {/* Falling background layer */}
      <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
        <FallingAEffect />
      </div>

      {/* Foreground card */}
      <div className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-lg z-10">
        <h2 className="text-2xl font-bold text-[#FF6B6B] mb-6 text-center">
          This Month's Questions
        </h2>

        <p className="text-gray-700 text-lg text-center mb-6">
          {questions[current]}
        </p>

        <input
          ref={inputRef}
          type="text"
          value={answers[current] || ''}
          onChange={handleAnswer}
          placeholder="Type your answer here"
          className="w-full p-3 border border-gray-300 rounded-xl focus:border-[#FF6B6B] outline-none transition"
        />

        <button
          onClick={handleNext}
          className="mt-6 w-full bg-[#FF6B6B] text-white py-3 rounded-xl hover:bg-[#e15555] transition"
        >
          {current < questions.length - 1 ? 'Next' : 'Submit'}
        </button>

        {error && (
          <p className="text-red-500 text-center text-sm mt-4">{error}</p>
        )}
      </div>
    </motion.div>
  );
};

export default MonthlyQuizPage;
