// src/components/pages/MonthlyQuizPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase.js';
import { doc, updateDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

const MonthlyQuizPage = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
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
      }
      setLoading(false);
    };
    fetchQuestions();
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
          monthlyQuiz: answers.reduce((acc, answer, index) => {
            acc[`mq${index + 1}`] = answer;
            return acc;
          }, {})
        });
      }
      navigate('/');
    }
  };

  if (loading) return <div className="container"><p>Loading monthly quiz...</p></div>;

  return (
    <div className="container">
      <h2>This Month's Questions</h2>
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

export default MonthlyQuizPage;