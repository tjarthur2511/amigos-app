// src/components/pages/ProfilePage/ProfilePage.jsx
import React, { useEffect, useState } from 'react';
import { auth, db } from '../../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import QuizTab from './QuizTab';
import ProfileInfo from './ProfileInfo';
import Preferences from './Preferences';
import ProfileSettings from './ProfileSettings';
import UserGrupos from './UserGrupos';
import UserPosts from './UserPosts';

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    const loadUser = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const ref = doc(db, 'users', user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) setUserData(snap.data());
      setLoading(false);
    };
    loadUser();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-2xl text-[#FF6B6B] font-bold">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center px-6 py-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-[#FF6B6B]">
        Welcome, {userData?.displayName || 'Amigo'}!
      </h1>

      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <button
          className={`px-4 py-2 rounded-full font-semibold ${
            activeTab === 'profile'
              ? 'bg-[#FF6B6B] text-white'
              : 'bg-white text-[#FF6B6B] border border-[#FF6B6B]'
          }`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        <button
          className={`px-4 py-2 rounded-full font-semibold ${
            activeTab === 'preferences'
              ? 'bg-[#FF6B6B] text-white'
              : 'bg-white text-[#FF6B6B] border border-[#FF6B6B]'
          }`}
          onClick={() => setActiveTab('preferences')}
        >
          Preferences
        </button>
        <button
          className={`px-4 py-2 rounded-full font-semibold ${
            activeTab === 'settings'
              ? 'bg-[#FF6B6B] text-white'
              : 'bg-white text-[#FF6B6B] border border-[#FF6B6B]'
          }`}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
        <button
          className={`px-4 py-2 rounded-full font-semibold ${
            activeTab === 'grupos'
              ? 'bg-[#FF6B6B] text-white'
              : 'bg-white text-[#FF6B6B] border border-[#FF6B6B]'
          }`}
          onClick={() => setActiveTab('grupos')}
        >
          Your Grupos
        </button>
        <button
          className={`px-4 py-2 rounded-full font-semibold ${
            activeTab === 'posts'
              ? 'bg-[#FF6B6B] text-white'
              : 'bg-white text-[#FF6B6B] border border-[#FF6B6B]'
          }`}
          onClick={() => setActiveTab('posts')}
        >
          Your Posts
        </button>
        <button
          className={`px-4 py-2 rounded-full font-semibold ${
            activeTab === 'quiz'
              ? 'bg-[#FF6B6B] text-white'
              : 'bg-white text-[#FF6B6B] border border-[#FF6B6B]'
          }`}
          onClick={() => setActiveTab('quiz')}
        >
          Quiz History
        </button>
      </div>

      {/* Dynamic Sections */}
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-6">
        {activeTab === 'profile' && <ProfileInfo userData={userData} />}
        {activeTab === 'preferences' && <Preferences userData={userData} />}
        {activeTab === 'settings' && <ProfileSettings userData={userData} />}
        {activeTab === 'grupos' && <UserGrupos userData={userData} />}
        {activeTab === 'posts' && <UserPosts userData={userData} />}
        {activeTab === 'quiz' && <QuizTab />}
      </div>
    </div>
  );
};

export default ProfilePage;
