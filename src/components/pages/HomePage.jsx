// src/components/pages/HomePage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../../firebase';
import { collection, getDocs, doc, getDoc, query, where } from 'firebase/firestore';
import FallingAEffect from './FallingAEffect';
import PostForm from '../common/PostForm';

const HomePage = () => {
  const navigate = useNavigate();
  const [feedItems, setFeedItems] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const userRef = doc(db, 'users', currentUser.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) return;
      const userData = userSnap.data();

      const followed = userData.following || [];
      const userGrupos = userData.grupos || [];
      let posts = [];

      if (followed.length > 0) {
        const postsQuery = query(collection(db, 'posts'), where('userId', 'in', followed));
        const postDocs = await getDocs(postsQuery);
        posts = postDocs.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'amigo' }));
      }

      if (userGrupos.length > 0) {
        const grupoPostsQuery = query(collection(db, 'posts'), where('grupoId', 'in', userGrupos));
        const grupoPostDocs = await getDocs(grupoPostsQuery);
        const grupoPosts = grupoPostDocs.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'grupo' }));
        posts = [...posts, ...grupoPosts];
      }

      posts.sort((a, b) => (b.timestamp?.toMillis?.() || 0) - (a.timestamp?.toMillis?.() || 0));
      setFeedItems(posts);
    };

    loadData();
  }, []);

  return (
    <div style={{
      fontFamily: 'Comfortaa, sans-serif',
      backgroundColor: '#FF6B6B',
      minHeight: '100vh',
      overflow: 'hidden',
      position: 'relative'
    }}>
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

      {/* ✅ PostForm goes here */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
        <div style={{ width: '90%', maxWidth: '800px' }}>
          <PostForm />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1.5rem', boxShadow: '0 5px 25px rgba(0,0,0,0.2)', width: '90%', maxWidth: '800px', minHeight: '60vh', textAlign: 'center', position: 'relative', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', color: '#FF6B6B', marginBottom: '1rem' }}>Your Feed</h2>
          {feedItems.length > 0 ? (
            <ul style={listStyle}>
              {feedItems.map((item) => (
                <li key={item.id} style={itemStyle}>
                  <p style={userName}>{item.title || 'Untitled Post'}</p>
                  <p style={userDetail}>{item.content}</p>
                </li>
              ))}
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

const userDetail = {
  fontSize: '0.9rem',
  color: '#555'
};

export default HomePage;
