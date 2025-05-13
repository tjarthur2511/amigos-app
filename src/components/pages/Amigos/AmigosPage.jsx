// ✅ Clean AmigosPage – No Backgrounds, All White Cards, Z-Index 0
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import FallingAEffect from '../../common/FallingAEffect';
import SuggestedAmigos from './SuggestedAmigos';
import AmigosUnidos from './AmigosUnidos';
import AmigosPosts from './AmigosPosts';

const AmigosPage = () => {
  const navigate = useNavigate();
  const [currentCard, setCurrentCard] = useState(1);
  const [userFollowing, setUserFollowing] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const feedCards = ['Suggested Amigos', 'Followed Amigos', 'Your Amigos Posts'];

  useEffect(() => {
    const fetchFollowing = async () => {
      const user = auth.currentUser;
      if (!user) return;

      setCurrentUserId(user.uid);
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const { following = [] } = userSnap.data();
        setUserFollowing(following);
      }
    };
    fetchFollowing();
  }, []);

  const nextCard = () => setCurrentCard((prev) => (prev + 1) % feedCards.length);
  const prevCard = () => setCurrentCard((prev) => (prev - 1 + feedCards.length) % feedCards.length);

  const renderCurrentFeed = () => {
    switch (feedCards[currentCard]) {
      case 'Suggested Amigos':
        return (
          <>
            <div style={{ textAlign: 'right', marginBottom: '0.5rem' }}>
              <button
                onClick={() => navigate('/explore-amigos')}
                style={exploreButtonStyle}
              >
                Explore ➜
              </button>
            </div>
            <SuggestedAmigos amigosToExclude={userFollowing} />
          </>
        );
      case 'Followed Amigos':
        return <AmigosUnidos />;
      case 'Your Amigos Posts':
        return <AmigosPosts />;
      default:
        return null;
    }
  };

  return (
    <div style={pageStyle}>
      <div style={bgEffect}><FallingAEffect /></div>

      <header style={headerStyle}>
        <h1 style={titleStyle}>amigos</h1>
      </header>

      <nav style={navWrapper}>
        <div style={navStyle}>
          <button onClick={() => navigate('/')} style={tabStyle}>Home</button>
          <button onClick={() => navigate('/amigos')} style={tabStyle}>Amigos</button>
          <button onClick={() => navigate('/grupos')} style={tabStyle}>Grupos</button>
          <button onClick={() => navigate('/profile')} style={tabStyle}>Profile</button>
        </div>
      </nav>

      {currentUserId && (
        <div className="flex justify-end mb-4 px-6">
          <button
            onClick={() => navigate(`/profile/${currentUserId}`)}
            className="bg-white text-[#FF6B6B] border border-[#FF6B6B] px-4 py-2 rounded-full font-semibold hover:bg-[#FF6B6B] hover:text-white transition"
          >
            View Your Public Profile
          </button>
        </div>
      )}

      <div style={mainCardWrapper}>
        <div style={mainCardStyle}>
          <h2 style={sectionTitle}>{feedCards[currentCard]}</h2>
          {renderCurrentFeed()}
          <div style={arrowRight}><button onClick={nextCard} style={arrowStyle}>→</button></div>
          <div style={arrowLeft}><button onClick={prevCard} style={arrowStyle}>←</button></div>
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

const titleStyle = {
  fontSize: '3.5rem',
  color: '#FF6B6B'
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

const exploreButtonStyle = {
  backgroundColor: 'white',
  color: '#FF6B6B',
  border: '1px solid #FF6B6B',
  borderRadius: '30px',
  padding: '4px 12px',
  fontSize: '0.9rem',
  cursor: 'pointer',
  fontFamily: 'Comfortaa, sans-serif'
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

export default AmigosPage;
