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
import FallingAEffect from '../../common/FallingAEffect';
import ProfilePhotos from './ProfilePhotos';
import ProfileGrupos from './ProfileGrupos';
import ProfileAmigos from './ProfileAmigos';
import ProfileQuestionsCenter from './ProfileQuestionsCenter';
import ProfileCard from './ProfileCard'; // ✅ added

const ProfilePage = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [currentCard, setCurrentCard] = useState(0);
  const feedCards = ['Your Posts', 'Photos', 'Grupos Unidos', 'Amigos', 'Preferences'];

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
              <li key={post.id} style={itemStyle}>
                <p style={userName}>{post.content || 'Untitled Post'}</p>
                {post.imageUrl && <img src={post.imageUrl} alt="Post" style={imageStyle} />}
                {post.videoUrl && (
                  <video controls style={imageStyle}>
                    <source src={post.videoUrl} type="video/mp4" />
                  </video>
                )}
                <button onClick={() => handleDelete(post.id)} style={deleteButton}>🗑️ Delete</button>
              </li>
            ))}
          </ul>
        ) : <p style={noPostText}>You haven't posted anything yet.</p>;

      case 'Photos':
        return <ProfilePhotos posts={posts} />;

      case 'Grupos Unidos':
        return <ProfileGrupos />;

      case 'Amigos':
        return <ProfileAmigos />;

      case 'Preferences':
        return <ProfileQuestionsCenter />;

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

      <ProfileCard /> {/* ✅ new component for profile photo + info */}

      <nav style={navWrapper}>
        <div style={navStyle}>
          <button onClick={() => navigate('/')} style={tabStyle}>Home</button>
          <button onClick={() => navigate('/amigos')} style={tabStyle}>Amigos</button>
          <button onClick={() => navigate('/grupos')} style={tabStyle}>Grupos</button>
          <button onClick={() => navigate('/profile')} style={tabStyle}>Profile</button>
        </div>
      </nav>

      <div style={mainCardWrapper}>
        <div style={mainCardStyle}>
          <h2 style={sectionTitle}>{feedCards[currentCard]}</h2>
          {renderCurrent()}

          <div style={arrowRight}><button onClick={nextCard} style={arrowStyle}>→</button></div>
          <div style={arrowLeft}><button onClick={prevCard} style={arrowStyle}>←</button></div>
        </div>
      </div>
    </div>
  );
};

const pageStyle = {
  fontFamily: 'Comfortaa, sans-serif',
  backgroundColor: '#FF6B6B',
  minHeight: '100vh',
  overflow: 'visible',
  position: 'relative'
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
  paddingTop: '2rem'
};

const titleStyle = {
  fontSize: '3.5rem',
  color: 'white'
};

const navWrapper = {
  display: 'flex',
  justifyContent: 'center',
  marginTop: '2rem',
  marginBottom: '2rem'
};

const navStyle = {
  backgroundColor: 'white',
  padding: '0.8rem 1rem',
  borderRadius: '30px',
  boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
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
  marginBottom: '2rem'
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
  zIndex: 10
};

const sectionTitle = {
  fontSize: '2rem',
  color: '#FF6B6B',
  marginBottom: '1rem'
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

const imageStyle = {
  maxWidth: '100%',
  borderRadius: '1rem',
  marginTop: '0.5rem'
};

const deleteButton = {
  marginTop: '0.75rem',
  fontSize: '0.8rem',
  color: '#FF6B6B',
  border: 'none',
  background: 'none',
  cursor: 'pointer'
};

const noPostText = {
  textAlign: 'center',
  color: '#FF6B6B'
};

const arrowRight = {
  position: 'absolute',
  right: '1rem',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 20
};

const arrowLeft = {
  position: 'absolute',
  left: '1rem',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 20
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
