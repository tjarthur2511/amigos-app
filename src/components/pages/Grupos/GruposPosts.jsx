import React, { useEffect, useState } from 'react';
import { db, auth } from '../../../firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';

const GruposPosts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchGruposPosts = async () => {
      const user = auth.currentUser;
      if (!user) return;

      // Get posts made in any grupo the user is part of
      const userDoc = await db.collection('users').doc(user.uid).get();
      const userData = userDoc.data();
      const joinedGrupos = userData?.joinedGrupos || [];

      if (!joinedGrupos.length) return;

      const q = query(
        collection(db, 'posts'),
        where('grupoId', 'in', joinedGrupos),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);
      const postsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(postsData);
    };

    fetchGruposPosts();
  }, []);

  return (
    <div style={containerStyle}>
      <h3 style={titleStyle}>Posts from Your Grupos</h3>
      {posts.length > 0 ? (
        <ul style={listStyle}>
          {posts.map(post => (
            <li key={post.id} style={postItemStyle}>
              <p style={postText}>{post.content || 'No text provided'}</p>
              {post.imageUrl && <img src={post.imageUrl} alt="Grupo Post" style={mediaStyle} />}
              {post.videoUrl && (
                <video controls style={mediaStyle}>
                  <source src={post.videoUrl} type="video/mp4" />
                </video>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p style={noPostStyle}>No posts found in your grupos yet.</p>
      )}
    </div>
  );
};

const containerStyle = {
  backgroundColor: '#fff0f0',
  padding: '1rem',
  borderRadius: '1rem',
  fontFamily: 'Comfortaa, sans-serif',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
};

const titleStyle = {
  color: '#FF6B6B',
  fontSize: '1.5rem',
  textAlign: 'center',
  marginBottom: '1rem'
};

const listStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem'
};

const postItemStyle = {
  backgroundColor: '#ffecec',
  padding: '1rem',
  borderRadius: '1rem',
  boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
};

const postText = {
  fontSize: '1rem',
  marginBottom: '0.5rem'
};

const mediaStyle = {
  width: '100%',
  borderRadius: '0.5rem'
};

const noPostStyle = {
  color: '#FF6B6B',
  textAlign: 'center',
  marginTop: '1rem'
};

export default GruposPosts;
