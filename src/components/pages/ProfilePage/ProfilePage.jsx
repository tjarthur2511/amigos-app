// src/components/pages/ProfilePage.jsx
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

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="container">
      <h1>Welcome, {userData?.displayName || 'Amigo'}!</h1>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
        <button onClick={() => setActiveTab('profile')}>Profile</button>
        <button onClick={() => setActiveTab('preferences')}>Preferences</button>
        <button onClick={() => setActiveTab('settings')}>Settings</button>
        <button onClick={() => setActiveTab('grupos')}>Your Grupos</button>
        <button onClick={() => setActiveTab('posts')}>Your Posts</button>
        <button onClick={() => setActiveTab('quiz')}>Quiz History</button>
      </div>

      {activeTab === 'profile' && <ProfileInfo userData={userData} />}
      {activeTab === 'preferences' && <Preferences userData={userData} />}
      {activeTab === 'settings' && <ProfileSettings userData={userData} />}
      {activeTab === 'grupos' && <UserGrupos userData={userData} />}
      {activeTab === 'posts' && <UserPosts userData={userData} />}
      {activeTab === 'quiz' && <QuizTab />}
    </div>
  );
};

export default ProfilePage;
