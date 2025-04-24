// src/components/pages/SetupQuizPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase.js';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

const questions = [
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
  const navigate = useNavigate();

  const handleAnswer = (e) => {
    const updated = [...answers];
    updated[currentQuestion] = e.target.value;
    setAnswers(updated);
  };

  const handleNext = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
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
    }
  };

  return (
    <div className="container">
      <h2>Let's Get to Know You</h2>
      <p>{questions[currentQuestion]}</p>
      <input
        type="text"
        value={answers[currentQuestion] || ''}
        onChange={handleAnswer}
        placeholder="Type your answer here"
      />
      <br />
      <button onClick={handleNext}>
        {currentQuestion < questions.length - 1 ? 'Next' : 'Finish'}
      </button>
    </div>
  );
};

export default SetupQuizPage;
