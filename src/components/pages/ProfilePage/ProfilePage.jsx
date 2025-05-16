import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import ProfileCard from './ProfileCard';
import ProfileQuestionsCenter from './ProfileQuestionsCenter';
import FallingAEffect from '../../common/FallingAEffect';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [currentCard, setCurrentCard] = useState(0);
  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [userId, setUserId] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [bio, setBio] = useState('');
  const [hobbies, setHobbies] = useState('');
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);

  const profileCards = ['Your Profile', 'Customize Public Profile', 'Quiz Questions'];

  useEffect(() => {
    const fetchUser = async () => {
      const user = auth.currentUser;
      if (!user) return;

      setUserId(user.uid);
      const ref = doc(db, 'users', user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setDisplayName(data.displayName || 'Unnamed Amigo');
        setPhotoURL(data.photoURL || 'https://cdn-icons-png.flaticon.com/512/847/847969.png');
        setIsAdmin(data.isAdmin || false);
        setBio(data.bio || '');
        setHobbies(data.hobbies || '');
        setStatus(data.status || '');
      }
    };
    fetchUser();
  }, []);

  const handleSavePublicProfile = async () => {
    if (!userId) return;
    setSaving(true);
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { bio, hobbies, status });
    setSaving(false);
  };

  const nextCard = () => setCurrentCard((prev) => (prev + 1) % profileCards.length);
  const prevCard = () => setCurrentCard((prev) => (prev - 1 + profileCards.length) % profileCards.length);

  const renderCardContent = () => {
    switch (profileCards[currentCard]) {
      case 'Your Profile':
        return (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
              <img src={photoURL} alt="User Avatar" style={avatarStyle} />
            </motion.div>
            <h2 style={sectionTitle}>{displayName}</h2>
            <ProfileCard />
            {isAdmin && (
              <div className="bg-white border border-[#FF6B6B] rounded-2xl p-6 mt-6 shadow text-center">
                <h3 className="text-xl font-bold text-[#FF6B6B] mb-2">🛠️ Admin Control Panel</h3>
                <p className="text-sm text-gray-600">Access moderation tools and backend dashboards here.</p>
                <button
                  onClick={() => navigate('/profile/admin')}
                  className="mt-3 bg-[#FF6B6B] text-white px-4 py-2 rounded-full hover:bg-[#e15555] transition"
                >
                  Go to Admin Panel
                </button>
              </div>
            )}
          </>
        );
      case 'Customize Public Profile':
        return (
          <>
            <h2 style={sectionTitle}>Customize Public Profile</h2>
            <div className="text-left">
              <div className="mb-4">
                <label className="block text-sm text-gray-700 mb-1">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2"
                  rows={2}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm text-gray-700 mb-1">Hobbies</label>
                <input
                  value={hobbies}
                  onChange={(e) => setHobbies(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2"
                  type="text"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm text-gray-700 mb-1">Status</label>
                <input
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2"
                  type="text"
                />
              </div>
              <button
                onClick={handleSavePublicProfile}
                className="bg-[#FF6B6B] text-white px-4 py-2 rounded-full hover:bg-[#e15555] transition"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Public Profile'}
              </button>
            </div>
          </>
        );
      case 'Quiz Questions':
        return <ProfileQuestionsCenter />;
      default:
        return null;
    }
  };

  return (
    <div style={pageStyle} className="font-[Comfortaa] bg-transparent min-h-screen overflow-hidden relative z-0">
      <div className="absolute top-0 left-0 w-full h-full -z-[1000] bg-[#FF6B6B]" />
      <div style={bgEffect} className="absolute top-0 left-0 w-full h-full -z-[500] pointer-events-none">
        <FallingAEffect />
      </div>

      <header style={headerStyle} className="z-[10]">
        <img
          src="/assets/amigoshangouts1.png"
          alt="Amigos Hangouts"
          style={{ height: '20em', width: 'auto', animation: 'pulse-a 1.75s infinite', marginBottom: '-5rem' }}
        />
      </header>

      <nav style={navWrapper} className="z-[10]">
        <div style={navStyle}>
          <button onClick={() => navigate('/')} style={tabStyle}>Home</button>
          <button onClick={() => navigate('/amigos')} style={tabStyle}>Amigos</button>
          <button onClick={() => navigate('/grupos')} style={tabStyle}>Grupos</button>
          <button onClick={() => navigate('/profile')} style={tabStyle}>Profile</button>
        </div>
      </nav>

      <div style={mainCardWrapper} className="z-[10]">
        <div style={mainCardStyle}>
          <h2 style={sectionTitle}>{profileCards[currentCard]}</h2>
          {renderCardContent()}
          <div style={arrowRight}><button onClick={nextCard} style={arrowStyle}>→</button></div>
          <div style={arrowLeft}><button onClick={prevCard} style={arrowStyle}>←</button></div>
        </div>
      </div>
    </div>
  );
};

// 🔧 Shared Styles
const pageStyle = {
  fontFamily: 'Comfortaa, sans-serif',
  backgroundColor: 'transparent',
  minHeight: '100vh',
  overflow: 'hidden',
  position: 'relative',
  zIndex: 0
};

const bgEffect = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: 0,
  pointerEvents: 'none'
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'center',
  paddingTop: '1rem',
  marginBottom: '-1rem'
};

const navWrapper = {
  display: 'flex',
  justifyContent: 'center',
  marginTop: '0rem',
  marginBottom: '1.5rem',
  zIndex: 0
};

const navStyle = {
  backgroundColor: 'white',
  padding: '0.8rem 1rem',
  borderRadius: '30px',
  boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
  display: 'flex',
  gap: '1rem'
};

const tabStyle = {
  backgroundColor: '#FF6B6B',
  color: 'white',
  border: 'none',
  padding: '12px 20px',
  borderRadius: '30px',
  fontSize: '1rem',
  fontWeight: 'bold',
  fontFamily: 'Comfortaa, sans-serif',
  cursor: 'pointer',
  boxShadow: '0 3px 8px rgba(0,0,0,0.2)'
};

const mainCardWrapper = {
  display: 'flex',
  justifyContent: 'center',
  marginBottom: '2rem',
  zIndex: 0
};

const mainCardStyle = {
  backgroundColor: 'white',
  padding: '2rem',
  borderRadius: '1.5rem',
  boxShadow: '0 5px 25px rgba(0,0,0,0.2)',
  width: '90%',
  maxWidth: '800px',
  minHeight: '60vh',
  textAlign: 'center',
  position: 'relative',
  zIndex: 0
};

const avatarStyle = {
  width: '8rem',
  height: '8rem',
  borderRadius: '50%',
  border: '4px solid #FF6B6B',
  boxShadow: '0 6px 15px rgba(0,0,0,0.2)',
  marginBottom: '1.5rem'
};

const sectionTitle = {
  fontSize: '2rem',
  color: '#FF6B6B',
  marginBottom: '1rem'
};

const arrowRight = {
  position: 'absolute',
  right: '1rem',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 0
};

const arrowLeft = {
  position: 'absolute',
  left: '1rem',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 0
};

const arrowStyle = {
  fontSize: '1.5rem',
  backgroundColor: '#FF6B6B',
  color: 'white',
  border: 'none',
  borderRadius: '50%',
  padding: '0.5rem 1rem',
  cursor: 'pointer'
};

export default ProfilePage;
