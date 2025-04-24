import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc
} from 'firebase/firestore';
import '../styles/MonthlyQuizPage.css';

const mockUserId = 'user123';

function MonthlyQuizPage() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const currentMonth = new Date().toISOString().slice(0, 7);

  useEffect(() => {
    const loadQuiz = async () => {
      const userRef = doc(db, 'users', mockUserId);
      const userSnap = await getDoc(userRef);
      const monthly = userSnap.data()?.monthlyQuiz;
      if (monthly?.month === currentMonth) {
        setSubmitted(true);
        setAnswers(monthly.answers);
        fetchSuggestions(monthly.answers);
        return;
      }

      const querySnap = await getDocs(collection(db, 'questionSets'));
      const monthlySet = querySnap.docs.find(
        doc => doc.data().type === 'monthly' && doc.data().month === currentMonth
      );
      if (monthlySet) {
        setQuestions(monthlySet.data().questions);
      }
    };

    loadQuiz();
  }, [currentMonth]);

  const handleSubmit = async () => {
    const userRef = doc(db, 'users', mockUserId);
    await setDoc(
      userRef,
      {
        monthlyQuiz: {
          month: currentMonth,
          answers
        }
      },
      { merge: true }
    );
    setSubmitted(true);
    fetchSuggestions(answers);
  };

  const fetchSuggestions = async (myAnswers) => {
    const snapshot = await getDocs(collection(db, 'users'));
    const others = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(user => user.id !== mockUserId && user.monthlyQuiz?.month === currentMonth);

    const scored = others.map(user => {
      const overlap = Object.entries(user.monthlyQuiz.answers || {}).reduce((score, [key, val]) => {
        return score + (myAnswers[key]?.toLowerCase() === val?.toLowerCase() ? 1 : 0);
      }, 0);
      return { ...user, matchScore: overlap };
    });

    const bestMatches = scored
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5);

    setSuggestions(bestMatches);
  };

  if (submitted) {
    return (
      <div className="monthly-quiz">
        <h2>✅ You’ve answered this month’s quiz!</h2>
        <p>Thanks for helping Amigos match you better!</p>

        {suggestions.length > 0 && (
          <>
            <h3>🧠 You might connect with:</h3>
            <div className="suggestion-list">
              {suggestions.map((user) => (
                <div key={user.id} className="suggestion-card">
                  <h4>{user.name || 'Unnamed Amigo'}</h4>
                  <p>{user.bio || 'No bio available.'}</p>
                  <p><strong>Match Score:</strong> {user.matchScore}/5</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="monthly-quiz">
      <h2>🧠 Monthly Amigo Match Quiz ({currentMonth})</h2>

      {questions.map((q, index) => (
        <div key={index} className="quiz-question">
          <label>{q}</label>
          <input
            type="text"
            value={answers[`mq${index + 1}`] || ''}
            onChange={(e) =>
              setAnswers({ ...answers, [`mq${index + 1}`]: e.target.value })
            }
          />
        </div>
      ))}

      {questions.length > 0 && (
        <button className="submit-btn" onClick={handleSubmit}>
          Submit Answers
        </button>
      )}
    </div>
  );
}

export default MonthlyQuizPage;
