// src/components/pages/Profile/QuizTab.jsx
import React, { useEffect, useState } from 'react';
import { db, auth } from '../../../firebase.js';
import { doc, getDoc } from 'firebase/firestore';

const QuizTab = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('onboarding');

  useEffect(() => {
    const fetchUser = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const ref = doc(db, 'users', user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setUserData(snap.data());
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const renderAnswers = (answers, prefix) => {
    return Object.entries(answers || {})
      .filter(([key]) => key.startsWith(prefix))
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => (
        <div key={key} className="card">
          <strong>{key.toUpperCase()}:</strong>
          <p>{value}</p>
        </div>
      ));
  };

  if (loading) return <p>Loading quizzes...</p>;

  return (
    <div className="container">
      <h2>Your Quiz History</h2>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button onClick={() => setActiveTab('onboarding')}>Onboarding</button>
        <button onClick={() => setActiveTab('monthly')}>Monthly</button>
        <button onClick={() => setActiveTab('weekly')}>Weekly</button>
      </div>
      {activeTab === 'onboarding' && renderAnswers(userData?.quizAnswers, 'q')}
      {activeTab === 'monthly' && renderAnswers(userData?.monthlyQuiz, 'mq')}
      {activeTab === 'weekly' && renderAnswers(userData?.weeklyQuiz, 'wq')}
    </div>
  );
};

export default QuizTab;
