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
        <div key={key} className="p-4 border rounded-lg shadow-md bg-white mb-4">
          <h4 className="font-bold text-[#FF6B6B]">{key.toUpperCase()}</h4>
          <p className="text-gray-700 mt-2">{value}</p>
        </div>
      ));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-40">
        <p className="text-[#FF6B6B] text-xl font-semibold">Loading quizzes...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-6">
      <h2 className="text-3xl font-bold text-[#FF6B6B]">Your Quiz History</h2>

      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded-full font-semibold ${
            activeTab === 'onboarding'
              ? 'bg-[#FF6B6B] text-white'
              : 'bg-white text-[#FF6B6B] border border-[#FF6B6B]'
          }`}
          onClick={() => setActiveTab('onboarding')}
        >
          Onboarding
        </button>
        <button
          className={`px-4 py-2 rounded-full font-semibold ${
            activeTab === 'monthly'
              ? 'bg-[#FF6B6B] text-white'
              : 'bg-white text-[#FF6B6B] border border-[#FF6B6B]'
          }`}
          onClick={() => setActiveTab('monthly')}
        >
          Monthly
        </button>
        <button
          className={`px-4 py-2 rounded-full font-semibold ${
            activeTab === 'weekly'
              ? 'bg-[#FF6B6B] text-white'
              : 'bg-white text-[#FF6B6B] border border-[#FF6B6B]'
          }`}
          onClick={() => setActiveTab('weekly')}
        >
          Weekly
        </button>
      </div>

      <div className="w-full max-w-3xl px-4">
        {activeTab === 'onboarding' && renderAnswers(userData?.quizAnswers, 'q')}
        {activeTab === 'monthly' && renderAnswers(userData?.monthlyQuiz, 'mq')}
        {activeTab === 'weekly' && renderAnswers(userData?.weeklyQuiz, 'wq')}
      </div>
    </div>
  );
};

export default QuizTab;
