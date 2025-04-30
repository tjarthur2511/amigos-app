// src/components/pages/HomePage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../../firebase';
import { collection, getDocs, doc, getDoc, query, where, limit } from 'firebase/firestore';
import FallingAEffect from './FallingAEffect';

const HomePage = () => {
  const navigate = useNavigate();

  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [suggestedGrupos, setSuggestedGrupos] = useState([]);
  const [followedPosts, setFollowedPosts] = useState([]);
  const [followedGrupos, setFollowedGrupos] = useState([]);
  const [liveUsers, setLiveUsers] = useState([]);
  const [filter, setFilter] = useState('All');
  const [currentCard, setCurrentCard] = useState(0);

  const feedCards = ['Suggested Amigos & Grupos', 'Followed Amigos', 'Followed Grupos', 'Go Live'];

  useEffect(() => {
    const loadData = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const userRef = doc(db, 'users', currentUser.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) return;
      const userData = userSnap.data();

      const allUsers = await getDocs(query(collection(db, 'users'), limit(100)));
      const suggestions = allUsers.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(u => u.id !== currentUser.uid && !(userData.following || []).includes(u.id));
      setSuggestedUsers(suggestions);

      const grupoDocs = await getDocs(query(collection(db, 'grupos'), limit(100)));
      const grupos = grupoDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSuggestedGrupos(grupos);

      const followed = userData.following || [];
      if (followed.length > 0) {
        const postsQuery = query(collection(db, 'posts'), where('userId', 'in', followed));
        const postDocs = await getDocs(postsQuery);
        const posts = postDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFollowedPosts(posts);
      }

      const userGrupos = userData.grupos || [];
      if (userGrupos.length > 0) {
        const followedGrupoDocs = await getDocs(collection(db, 'grupos'));
        const matched = followedGrupoDocs.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(grupo => userGrupos.includes(grupo.id));
        setFollowedGrupos(matched);
      }

      const liveQuery = query(collection(db, 'users'), where('isLive', '==', true));
      const liveDocs = await getDocs(liveQuery);
      const lives = liveDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLiveUsers(lives);
    };
    loadData();
  }, []);

  const nextFeed = () => {
    setCurrentCard((prev) => (prev + 1) % feedCards.length);
  };

  const prevFeed = () => {
    setCurrentCard((prev) => (prev - 1 + feedCards.length) % feedCards.length);
  };

  const renderCurrentFeed = () => {
    switch (feedCards[currentCard]) {
      case 'Suggested Amigos & Grupos':
        return (
          <div style={{ maxHeight: '50vh', overflowY: 'auto' }}>
            {suggestedUsers.length > 0 && (
              <>
                <h3 style={subheaderStyle}>amigos</h3>
                <ul style={listStyle}>
                  {suggestedUsers.map((user) => (
                    <li key={user.id} style={itemStyle}>
                      <p style={userName}>{user.displayName}</p>
                      <p style={userDetail}>{user.email}</p>
                    </li>
                  ))}
                </ul>
              </>
            )}
            {suggestedGrupos.length > 0 && (
              <>
                <h3 style={subheaderStyle}>grupos</h3>
                <ul style={listStyle}>
                  {suggestedGrupos.map((grupo) => (
                    <li key={grupo.id} style={itemStyle}>
                      <p style={userName}>{grupo.name}</p>
                      <p style={userDetail}>{grupo.description || 'No description'}</p>
                    </li>
                  ))}
                </ul>
              </>
            )}
            {suggestedUsers.length === 0 && suggestedGrupos.length === 0 && <p>No suggestions yet.</p>}
          </div>
        );
      case 'Followed Amigos':
        return followedPosts.length ? (
          <ul style={listStyle}>
            {followedPosts.map((post) => (
              <li key={post.id} style={itemStyle}>
                <h3 style={userName}>{post.title}</h3>
                <p>{post.content}</p>
              </li>
            ))}
          </ul>
        ) : <p>No posts from amigos yet.</p>;
      case 'Followed Grupos':
        return followedGrupos.length ? (
          <ul style={listStyle}>
            {followedGrupos.map((grupo) => (
              <li key={grupo.id} style={itemStyle}>
                <p style={userName}>{grupo.name}</p>
                <p>{grupo.description}</p>
              </li>
            ))}
          </ul>
        ) : <p>No followed grupos yet.</p>;
      case 'Go Live':
        const filteredLive = liveUsers.filter(user => {
          if (filter === 'All') return true;
          if (filter === 'Amigos') return (user.following || []).includes(auth.currentUser?.uid);
          if (filter === 'Grupos') return (user.grupos || []).length > 0;
          if (filter === 'Online') return user.isOnline;
          return true;
        });
        return (
          <>
            <p style={{ fontSize: '1rem', color: '#333', marginBottom: '1rem' }}>Launch your live stream and invite amigos!</p>
            <button style={{ backgroundColor: '#FF6B6B', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '30px', fontSize: '1rem', fontFamily: 'Comfortaa, sans-serif', cursor: 'pointer', marginBottom: '1rem' }}>
              Start Live Session
            </button>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="filter" style={{ color: '#555', fontWeight: 'bold', marginRight: '0.5rem' }}>Filter:</label>
              <select id="filter" value={filter} onChange={(e) => setFilter(e.target.value)} style={{ padding: '0.4rem 0.8rem', borderRadius: '8px', border: '1px solid #ccc' }}>
                <option value="All">All</option>
                <option value="Amigos">Amigos</option>
                <option value="Grupos">Grupos</option>
                <option value="Online">Online</option>
              </select>
            </div>
            <ul style={listStyle}>
              {filteredLive.map((user) => (
                <li key={user.id} style={itemStyle}>
                  <p style={userName}>{user.displayName}</p>
                  <p style={userDetail}>Live now</p>
                </li>
              ))}
            </ul>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{
      fontFamily: 'Comfortaa, sans-serif',
      backgroundColor: '#FF6B6B',
      minHeight: '100vh',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* ✅ Falling background fix */}
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
        <h1 style={{ fontSize: '3.5rem', color: 'white' }}>amigos</h1>
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
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1.5rem', boxShadow: '0 5px 25px rgba(0,0,0,0.2)', width: '90%', maxWidth: '800px', minHeight: '60vh', textAlign: 'center', position: 'relative', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', color: '#FF6B6B', marginBottom: '1rem' }}>{feedCards[currentCard]}</h2>
          {renderCurrentFeed()}
          <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)' }}>
            <button onClick={nextFeed} style={arrowStyle}>→</button>
          </div>
          <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}>
            <button onClick={prevFeed} style={arrowStyle}>←</button>
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
  marginTop: '1rem'
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

export default HomePage;
