// src/components/pages/SetupQuizPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from "../../firebase";
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import FallingAEffect from '../common/FallingAEffect';

const staticQuestions = [
  "What's your favorite way to relax?",
  "Which activities make you lose track of time?",
  "Do you prefer small groups or big gatherings?",
  "What do you enjoy doing outdoors?",
  "What’s a new skill you’d like to learn?",
  "What kind of games do you love?",
  "What’s your go-to creative outlet?",
  "Do you prefer daytime or nighttime adventures?",
  "How do you usually spend weekends?",
  "What topic could you talk about for hours?"
];

const SetupQuizPage = () => {
  const [answers, setAnswers] = useState(Array(10).fill(''));
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [currentQuestion]);

  const handleAnswer = (e) => {
    const updated = [...answers];
    updated[currentQuestion] = e.target.value;
    setAnswers(updated);
  };

  const handleNext = async () => {
    const wordCount = answers[currentQuestion]?.trim().split(/\s+/).length;
    if (wordCount < 3) {
      alert('Please write at least 3 words! Amigos love details 🌟');
      return;
    }

    if (currentQuestion < staticQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      try {
        setLoading(true);
        const user = auth.currentUser;
        if (user) {
          const userRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
            await updateDoc(userRef, {
              quizAnswers: answers.reduce((acc, answer, index) => {
                acc[`q${index + 1}`] = answer;
                return acc;
              }, {})
            });
          }
        }
        navigate('/');
      } catch (err) {
        console.error(err);
        setError('Failed to save your answers. Please try again.');
        setLoading(false);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col items-center justify-center min-h-screen p-6 bg-[#FF6B6B] relative font-[Comfortaa] overflow-hidden"
    >
      {/* ✅ background layer */}
      <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
        <FallingAEffect />
      </div>

      {/* ✅ foreground content */}
      <div className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-lg z-10">
        <h2 className="text-3xl font-bold text-[#FF6B6B] mb-6 text-center">
          Let's Get to Know You
        </h2>

        <p className="text-gray-700 text-lg text-center mb-6">
          {staticQuestions[currentQuestion]}
        </p>

        <input
          ref={inputRef}
          type="text"
          value={answers[currentQuestion] || ''}
          onChange={handleAnswer}
          placeholder="Type your answer here"
          className="w-full p-3 border border-gray-300 rounded-xl focus:border-[#FF6B6B] outline-none transition"
          disabled={loading}
        />

        <button
          onClick={handleNext}
          disabled={loading}
          className="mt-6 w-full bg-[#FF6B6B] text-white py-3 rounded-xl hover:bg-[#e15555] transition"
        >
          {loading
            ? 'Saving...'
            : currentQuestion < staticQuestions.length - 1
            ? 'Next'
            : 'Finish'}
        </button>

        {error && (
          <p className="text-red-500 text-center text-sm mt-4">{error}</p>
        )}
      </div>
    </motion.div>
  );
};

export default SetupQuizPage;
