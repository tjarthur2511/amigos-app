// ✅ Full ProfilePage.jsx – Coral Outline Buttons Fixed
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import ProfileCard from './ProfileCard';
import ProfileQuestionsCenter from './ProfileQuestionsCenter';
import ProfilePhotos from './ProfilePhotos';
import FallingAEffect from '../../common/FallingAEffect';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [currentCard, setCurrentCard] = useState(0);
  const [displayName, setDisplayName] = useState('');
  const [userId, setUserId] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [bio, setBio] = useState('');
  const [hobbies, setHobbies] = useState('');
  const [status, setStatus] = useState('');
  const [pronouns, setPronouns] = useState('');
  const [location, setLocation] = useState('');
  const [background, setBackground] = useState('');
  const [saving, setSaving] = useState(false);

  const profileCards = ['Your Profile', 'Quiz Questions', 'Your Photos'];

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
        setIsAdmin(data.isAdmin || false);
        setBio(data.bio || '');
        setHobbies(data.hobbies || '');
        setStatus(data.status || '');
        setPronouns(data.pronouns || '');
        setLocation(data.location || '');
        setBackground(data.background || '');
      }
    };
    fetchUser();
  }, []);

  const handleSavePublicProfile = async () => {
    if (!userId) return;
    setSaving(true);
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      displayName,
      bio,
      hobbies,
      status,
      pronouns,
      location,
      background,
    });
    setSaving(false);
  };

  const nextCard = () => setCurrentCard((prev) => (prev + 1) % profileCards.length);
  const prevCard = () => setCurrentCard((prev) => (prev - 1 + profileCards.length) % profileCards.length);

  const renderCardContent = () => {
    switch (profileCards[currentCard]) {
      case 'Your Profile':
        return (
          <>
            <h2 style={sectionTitle}>Customize Your Public Profile</h2>
            <div style={{ maxWidth: '500px', margin: '0 auto' }} className="space-y-5 pt-4">
              {[{ label: 'Display Name', value: displayName, setter: setDisplayName },
              { label: 'Bio', value: bio, setter: setBio },
              { label: 'Hobbies', value: hobbies, setter: setHobbies },
              { label: 'Status', value: status, setter: setStatus },
              { label: 'Pronouns', value: pronouns, setter: setPronouns },
              { label: 'Location', value: location, setter: setLocation }].map(
                ({ label, value, setter }) => (
                  <div key={label} className="text-center">
                    <label className="block text-sm text-gray-700 mb-1 text-center font-medium">{label}</label>
                    <textarea
                      value={value}
                      onChange={(e) => setter(e.target.value)}
                      className="w-full border border-coral rounded-full px-5 py-3 text-sm text-center bg-white shadow shadow-coral/50 focus:outline-none focus:ring-2 focus:ring-coral focus:border-transparent resize-y"
                      rows={3}
                    />
                  </div>
                )
              )}
              <div className="text-center" style={{ marginBottom: '1rem' }}>
                <label className="block text-sm text-gray-700 mb-1 text-center font-medium">Profile Background</label>
                <select
                  value={background || ''}
                  onChange={(e) => setBackground(e.target.value)}
                  className="w-full border border-coral rounded-full px-5 py-3 text-sm text-center bg-white shadow shadow-coral/50 focus:outline-none focus:ring-2 focus:ring-coral focus:border-transparent"
                >
                  <option value="">Default Coral</option>
                  <option value="beach">🏖️ Beach Vibes</option>
                  <option value="city">🌆 Urban Skyline</option>
                  <option value="forest">🌲 Nature Escape</option>
                  <option value="galaxy">🌌 Galaxy Mode</option>
                </select>
              </div>
              <div className="mt-4 flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={handleSavePublicProfile}
                  className="text-[#FF6B6B] border-2 border-[#FF6B6B] px-8 py-3 rounded-full font-bold transition duration-300 hover:bg-[#FF6B6B] hover:text-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : '💾 Save Profile'}
                </button>
                <button
                  onClick={() => navigate(`/profile/${userId}`)}
                  className="text-[#FF6B6B] border-2 border-[#FF6B6B] px-8 py-3 rounded-full font-bold transition duration-300 hover:bg-[#FF6B6B] hover:text-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
                >
                  🔍 View Public Profile
                </button>
              </div>
            </div>
          </>
        );
      case 'Quiz Questions':
        return <ProfileQuestionsCenter />;
      case 'Your Photos':
        return (
          <>
            <h2 style={sectionTitle}>📸 Your Photos</h2>
            <ProfilePhotos />
          </>
        );
      default:
        return null;
    }
  };

  const sectionTitle = {
    fontSize: '2rem',
    color: '#FF6B6B',
    marginBottom: '1rem'
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

  const adminButtonWrapper = {
    position: 'absolute',
    top: '105px',
    right: '40px',
    zIndex: 50
  };

  const adminButtonStyle = {
    backgroundColor: '#FF6B6B',
    color: 'white',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '30px',
    padding: '0.6rem 1.2rem',
    fontSize: '0.9rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    cursor: 'pointer',
    transition: 'all 0.25s ease-in-out'
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

      {isAdmin && (
        <div style={adminButtonWrapper}>
          <button onClick={() => navigate('/profile/admin')} style={adminButtonStyle}>
            🛠️ Admin Panel
          </button>
        </div>
      )}

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

export default ProfilePage;
