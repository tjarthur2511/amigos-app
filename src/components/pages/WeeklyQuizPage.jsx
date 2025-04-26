// src/components/pages/WeeklyQuizPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase.js'; // 🔥 Correct path
import { doc, updateDoc, getDoc, collection, getDocs } from 'firebase/firestore';
import { motion } from 'framer-motion';

const WeeklyQuizPage = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWeekly = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'weeklyQuestion'));
        const qList = snapshot.docs.map(doc => doc.data().question);
        if (qList.length === 0) {
          setError('No weekly questions available.');
        }
        setQuestions(qList);
        setAnswers(Array(qList.length).fill(''));
      } catch (err) {
        console.error(err);
        setError('Failed to load weekly questions.');
      } finally {
        setLoading(false);
      }
    };
    fetchWeekly();
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [current]);

  const handleAnswer = (e) => {
    const updated = [...answers];
    updated[current] = e.target.value;
    setAnswers(updated);
  };

  const handleNext = async () => {
    const wordCount = answers[current]?.trim().split(/\s+/).length;
    if (wordCount < 3) {
      alert('Please write at least 3 words! Amigos love details 🌟');
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
            const currentWeeklyQuiz = docSnap.data().weeklyQuiz || {};
            const newAnswers = answers.reduce((acc, answer, index) => {
              if (answer.trim() !== '') {
                acc[`wq${index + 1}`] = answer;
              }
              return acc;
            }, {});

            await updateDoc(userRef, {
              weeklyQuiz: {
                ...currentWeeklyQuiz,
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
      <div className="container flex items-center justify-center min-h-screen">
        <p>Loading weekly quiz...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50"
    >
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-[#FF6B6B] mb-6 text-center">
          This Week's Questions
        </h2>

        <p className="text-gray-700 text-lg text-center mb-6">{questions[current]}</p>

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

export default WeeklyQuizPage;
