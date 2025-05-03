// src/components/pages/ProfilePage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../../../firebase';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc
} from 'firebase/firestore';
import FallingAEffect from '../FallingAEffect';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [currentCard, setCurrentCard] = useState(0);
  const feedCards = ['Your Posts', 'Your Grupos', 'Settings'];

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (!user) return;

      const q = query(
        collection(db, 'posts'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );

      const unsubscribePosts = onSnapshot(q, (snapshot) => {
        const userPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPosts(userPosts);
      });

      return () => unsubscribePosts();
    });

    return () => unsubscribeAuth();
  }, []);

  const handleDelete = async (postId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this post?');
    if (!confirmDelete) return;
    try {
      await deleteDoc(doc(db, 'posts', postId));
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  const nextCard = () => setCurrentCard((prev) => (prev + 1) % feedCards.length);
  const prevCard = () => setCurrentCard((prev) => (prev - 1 + feedCards.length) % feedCards.length);

  const renderCurrent = () => {
    switch (feedCards[currentCard]) {
      case 'Your Posts':
        return posts.length > 0 ? (
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {posts.map(post => (
              <li key={post.id} style={{ backgroundColor: '#ffecec', padding: '1rem', borderRadius: '1rem', boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }}>
                <p style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{post.content || 'Untitled Post'}</p>
                {post.imageUrl && <img src={post.imageUrl} alt="Post" style={{ maxWidth: '100%', borderRadius: '1rem', marginTop: '0.5rem' }} />}
                {post.videoUrl && (
                  <video controls style={{ maxWidth: '100%', borderRadius: '1rem', marginTop: '0.5rem' }}>
                    <source src={post.videoUrl} type="video/mp4" />
                  </video>
                )}
                <button onClick={() => handleDelete(post.id)} style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: '#FF6B6B', border: 'none', background: 'none', cursor: 'pointer' }}>🗑️ Delete</button>
              </li>
            ))}
          </ul>
        ) : <p style={{ textAlign: 'center', color: '#FF6B6B' }}>You haven't posted anything yet.</p>;

      case 'Your Grupos':
        return <p style={{ textAlign: 'center', color: '#FF6B6B' }}>Grupos feature coming soon.</p>;

      case 'Settings':
        return <p style={{ textAlign: 'center', color: '#FF6B6B' }}>Settings feature coming soon.</p>;

      default:
        return null;
    }
  };

  return (
    <div style={{ fontFamily: 'Comfortaa, sans-serif', backgroundColor: '#FF6B6B', minHeight: '100vh', overflow: 'visible', position: 'relative' }}>
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
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1.5rem', boxShadow: '0 5px 25px rgba(0,0,0,0.2)', width: '90%', maxWidth: '800px', minHeight: '60vh', textAlign: 'center', position: 'relative', zIndex: 10 }}>
          <h2 style={{ fontSize: '2rem', color: '#FF6B6B', marginBottom: '1rem' }}>{feedCards[currentCard]}</h2>
          {renderCurrent()}

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

export default ProfilePage;
