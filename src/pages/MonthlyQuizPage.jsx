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

  const currentMonth = new Date().toISOString().slice(0, 7); // "YYYY-MM"

  useEffect(() => {
    const loadQuiz = async () => {
      // Get user's quiz status
      const userRef = doc(db, 'users', mockUserId);
      const userSnap = await getDoc(userRef);
      const monthly = userSnap.data()?.monthlyQuiz;
      if (monthly?.month === currentMonth) {
        setSubmitted(true);
        return;
      }

      // Load monthly questions
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
  };

  if (submitted) {
    return (
      <div className="monthly-quiz">
        <h2>✅ You’ve answered this month’s questions!</h2>
        <p>Thanks for helping Amigos match you better!</p>
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
