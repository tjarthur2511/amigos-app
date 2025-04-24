// src/components/pages/WeeklyQuizPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase.js';
import { doc, updateDoc, getDoc, collection, getDocs } from 'firebase/firestore';

const WeeklyQuizPage = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWeekly = async () => {
      const snapshot = await getDocs(collection(db, 'weeklyQuestion'));
      const qList = snapshot.docs.map(doc => doc.data().question);
      setQuestions(qList);
      setAnswers(Array(qList.length).fill(''));
      setLoading(false);
    };
    fetchWeekly();
  }, []);

  const handleAnswer = (e) => {
    const updated = [...answers];
    updated[current] = e.target.value;
    setAnswers(updated);
  };

  const handleNext = async () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          weeklyQuiz: answers.reduce((acc, answer, index) => {
            acc[`wq${index + 1}`] = answer;
            return acc;
          }, {})
        });
      }
      navigate('/');
    }
  };

  if (loading) return <div className="container"><p>Loading weekly quiz...</p></div>;

  return (
    <div className="container">
      <h2>This Week's Questions</h2>
      <p>{questions[current]}</p>
      <input
        type="text"
        value={answers[current] || ''}
        onChange={handleAnswer}
        placeholder="Type your answer here"
      />
      <br />
      <button onClick={handleNext}>
        {current < questions.length - 1 ? 'Next' : 'Submit'}
      </button>
    </div>
  );
};

export default WeeklyQuizPage;
