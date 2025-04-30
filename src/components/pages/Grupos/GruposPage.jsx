// src/components/pages/Grupos/GruposPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../../../firebase';
import { collection, getDocs, doc, getDoc, query, where, limit } from 'firebase/firestore';
import FallingAEffect from '../FallingAEffect';

const GruposPage = () => {
  const navigate = useNavigate();

  const [suggestedGrupos, setSuggestedGrupos] = useState([]);
  const [joinedGrupos, setJoinedGrupos] = useState([]);
  const [meetupGrupos, setMeetupGrupos] = useState([]);
  const [recentNearbyPosts, setRecentNearbyPosts] = useState([]);
  const [currentCard, setCurrentCard] = useState(1);

  const feedCards = ['Suggested Grupos', 'Joined Grupos', 'Meetups & Local Feed'];

  useEffect(() => {
    const loadGrupos = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) return;
      const userData = userSnap.data();

      const allGrupos = await getDocs(query(collection(db, 'grupos'), limit(100)));
      const grupos = allGrupos.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      setSuggestedGrupos(grupos.filter(g => !(userData.grupos || []).includes(g.id)).slice(0, 10));
      setJoinedGrupos(grupos.filter(g => (userData.grupos || []).includes(g.id)));
      setMeetupGrupos(grupos.filter(g => g.location).slice(0, 10));

      const allPosts = await getDocs(collection(db, 'posts'));
      const nearby = allPosts.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(post => post.location && post.location.toLowerCase().includes((userData.location || '').toLowerCase()));
      setRecentNearbyPosts(nearby);
    };

    loadGrupos();
  }, []);

  const nextCard = () => {
    setCurrentCard((prev) => (prev + 1) % feedCards.length);
  };

  const prevCard = () => {
    setCurrentCard((prev) => (prev - 1 + feedCards.length) % feedCards.length);
  };

  const renderCurrentFeed = () => {
    switch (feedCards[currentCard]) {
      case 'Suggested Grupos':
        return suggestedGrupos.length ? (
          <ul style={listStyle}>
            {suggestedGrupos.map((g) => (
              <li key={g.id} style={itemStyle}>
                <p style={userName}>{g.name}</p>
                <p style={userDetail}>{g.description}</p>
              </li>
            ))}
          </ul>
        ) : <p>No suggested grupos yet.</p>;
      case 'Joined Grupos':
        return joinedGrupos.length ? (
          <ul style={listStyle}>
            {joinedGrupos.map((g) => (
              <li key={g.id} style={itemStyle}>
                <p style={userName}>{g.name}</p>
                <p style={userDetail}>{g.description}</p>
              </li>
            ))}
          </ul>
        ) : <p>You haven’t joined any grupos yet.</p>;
      case 'Meetups & Local Feed':
        return (
          <>
            <h3 style={subheaderStyle}>Grupos With Meetups</h3>
            {meetupGrupos.length ? (
              <ul style={listStyle}>
                {meetupGrupos.map((g) => (
                  <li key={g.id} style={itemStyle}>
                    <p style={userName}>{g.name}</p>
                    <p style={userDetail}>{g.location || 'No location set'}</p>
                  </li>
                ))}
              </ul>
            ) : <p>No meetups scheduled yet.</p>}

            <h3 style={subheaderStyle}>Local Grupos Posts</h3>
            {recentNearbyPosts.length ? (
              <ul style={listStyle}>
                {recentNearbyPosts.map((post) => (
                  <li key={post.id} style={itemStyle}>
                    <p style={userName}>{post.title}</p>
                    <p style={userDetail}>{post.content}</p>
                  </li>
                ))}
              </ul>
            ) : <p>No local posts yet.</p>}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ fontFamily: 'Comfortaa, sans-serif', backgroundColor: '#FF6B6B', minHeight: '100vh', overflow: 'hidden', position: 'relative' }}>
      
      {/* ✅ Falling A Effect background wrapper fix */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none'
      }}>
        <FallingAEffect />
      </div>

      <header style={{ textAlign: 'center', paddingTop: '2rem' }}>
        <h1 style={{ fontSize: '3.5rem', color: 'white' }}>grupos</h1>
      </header>

      <nav style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem', marginBottom: '2rem' }}>
        <div style={{ backgroundColor: 'white', padding: '0.8rem 1rem', borderRadius: '30px', boxShadow: '0 5px 15px rgba(0,0,0,0.3)', display: 'flex', gap: '1rem' }}>
          <button onClick={() => navigate('/')} style={tabStyle}>Home</button>
          <button onClick={() => navigate('/amigos')} style={tabStyle}>Amigos</button>
          <button onClick={() => navigate('/grupos')} style={tabStyle}>Grupos</button>
          <button onClick={() => navigate('/profile')} style={tabStyle}>Profile</button>
        </div>
      </nav>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1.5rem', boxShadow: '0 5px 25px rgba(0,0,0,0.2)', width: '90%', maxWidth: '800px', minHeight: '60vh', textAlign: 'center', position: 'relative', marginBottom: '2rem', overflowY: 'auto', maxHeight: '70vh' }}>
          <h2 style={{ fontSize: '2rem', color: '#FF6B6B', marginBottom: '1rem' }}>{feedCards[currentCard]}</h2>
          {renderCurrentFeed()}
          <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', zIndex: 20 }}>
            <button onClick={nextCard} style={arrowStyle}>→</button>
          </div>
          <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', zIndex: 20 }}>
            <button onClick={prevCard} style={arrowStyle}>←</button>
          </div>
        </div>
      </div>
    </div>
  );
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

const arrowStyle = {
  fontSize: '1.5rem',
  backgroundColor: '#FF6B6B',
  color: 'white',
  border: 'none',
  borderRadius: '50%',
  padding: '0.5rem 1rem',
  cursor: 'pointer'
};

const subheaderStyle = {
  fontSize: '1.2rem',
  color: '#FF6B6B',
  marginTop: '1.5rem',
  marginBottom: '0.5rem'
};

const listStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  marginTop: '1rem'
};

const itemStyle = {
  backgroundColor: '#ffecec',
  padding: '1rem',
  borderRadius: '1rem',
  boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
};

const userName = {
  fontSize: '1.2rem',
  fontWeight: 'bold'
};

const userDetail = {
  fontSize: '0.9rem',
  color: '#555'
};

export default GruposPage;
