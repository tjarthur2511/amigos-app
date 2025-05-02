// src/components/pages/HomePage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../../firebase';
import { collection, onSnapshot, query, doc, updateDoc } from 'firebase/firestore';
import FallingAEffect from './FallingAEffect';

const emojiOptions = ['👍', '👎', '😂', '🔥', '❤️'];

const HomePage = () => {
  const navigate = useNavigate();
  const [feedItems, setFeedItems] = useState([]);
  const [hoveredPostId, setHoveredPostId] = useState(null);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const feedQuery = query(collection(db, 'posts'));
    const unsubscribe = onSnapshot(feedQuery, (snapshot) => {
      const posts = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((post) => post.userId === currentUser.uid)
        .sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));

      setFeedItems(posts);
    });

    return () => unsubscribe();
  }, []);

  const handleReact = async (postId, newReaction) => {
    const postRef = doc(db, 'posts', postId);
    const userId = auth.currentUser?.uid;
    const post = feedItems.find((p) => p.id === postId);
    const currentReactions = post.reactions || {};
    const updatedReactions = { ...currentReactions, [userId]: newReaction };
    await updateDoc(postRef, { reactions: updatedReactions });
  };

  return (
    <div style={{ fontFamily: 'Comfortaa, sans-serif', backgroundColor: '#FF6B6B', minHeight: '100vh', overflow: 'hidden', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}>
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
          <h2 style={{ fontSize: '2rem', color: '#FF6B6B', marginBottom: '1rem' }}>Your Feed</h2>
          {feedItems.length > 0 ? (
            <ul style={listStyle}>
              {feedItems.map((item) => {
                const currentUserReaction = item.reactions?.[auth.currentUser?.uid] || null;
                const reactionCount = Object.keys(item.reactions || {}).length;
                return (
                  <li key={item.id} style={itemStyle}>
                    <p style={userName}>{item.content || 'Untitled Post'}</p>
                    {item.imageUrl && <img src={item.imageUrl} alt="Post" style={{ maxWidth: '100%', borderRadius: '1rem' }} />}
                    {item.videoUrl && (
                      <video controls style={{ maxWidth: '100%', borderRadius: '1rem' }}>
                        <source src={item.videoUrl} type="video/mp4" />
                      </video>
                    )}
                    <div
                      style={{ marginTop: '0.5rem', position: 'relative', display: 'inline-block' }}
                      onMouseEnter={() => setHoveredPostId(item.id)}
                      onMouseLeave={() => setHoveredPostId(null)}
                    >
                      <button style={reactionButtonStyle}>{currentUserReaction || '👍'} {reactionCount}</button>
                      {hoveredPostId === item.id && (
                        <div style={{ position: 'absolute', top: '120%', left: '0', background: 'white', borderRadius: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.2)', padding: '0.5rem', display: 'flex', gap: '0.5rem', zIndex: 10 }}>
                          {emojiOptions.map((emoji) => (
                            <span
                              key={emoji}
                              style={{ cursor: 'pointer', fontSize: '1.3rem' }}
                              onClick={() => handleReact(item.id, emoji)}
                            >
                              {emoji}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p>No content to display yet. Follow amigos or join grupos to see activity.</p>
          )}
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

const reactionButtonStyle = {
  backgroundColor: '#fff',
  color: '#FF6B6B',
  border: '1px solid #FF6B6B',
  borderRadius: '9999px',
  padding: '0.4rem 1rem',
  fontFamily: 'Comfortaa, sans-serif',
  cursor: 'pointer'
};

export default HomePage;
