// ✅ Clean ProfilePage – Consistent with AmigosPage Theme
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import ProfileCard from './ProfileCard';
import ProfileQuestionsCenter from './ProfileQuestionsCenter';
import FallingAEffect from '../../common/FallingAEffect';
import NavBar from '../../NavBar';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [userId, setUserId] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

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
      }
    };
    fetchUser();
  }, []);

  return (
    <div style={pageStyle}>
      <div style={bgEffect}><FallingAEffect /></div>

      <header style={headerStyle}>
        <img src="/assets/amigoshangouts1.png" alt="Amigos Logo" style={logoStyle} />
      </header>

      <nav style={navWrapper}>
        <div style={navStyle}>
          <button onClick={() => navigate('/')} style={tabStyle}>Home</button>
          <button onClick={() => navigate('/amigos')} style={tabStyle}>Amigos</button>
          <button onClick={() => navigate('/grupos')} style={tabStyle}>Grupos</button>
          <button onClick={() => navigate('/profile')} style={tabStyle}>Profile</button>
        </div>
      </nav>

      {userId && (
        <div className="flex justify-end mb-4 px-6">
          <button
            onClick={() => navigate(`/profile/${userId}`)}
            className="bg-white text-[#FF6B6B] border border-[#FF6B6B] px-4 py-2 rounded-full font-semibold hover:bg-[#FF6B6B] hover:text-white transition"
          >
            View As Public
          </button>
        </div>
      )}

      <div style={mainCardWrapper}>
        <div style={mainCardStyle}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          >
            <img
              src={photoURL}
              alt="User Avatar"
              style={avatarStyle}
            />
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

          <ProfileQuestionsCenter />
        </div>
      </div>
    </div>
  );
};

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
  textAlign: 'center',
  paddingTop: '2rem',
  zIndex: 0
};

const logoStyle = {
  height: '3.5rem',
  filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))'
};

const navWrapper = {
  display: 'flex',
  justifyContent: 'center',
  marginTop: '2rem',
  marginBottom: '2rem',
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
  marginBottom: '1.5rem'
};

export default ProfilePage;
