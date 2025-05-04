import React, { useEffect, useState } from 'react';
import { db, auth } from '../../../firebase';
import {
  collection,
  query,
  where,
  getDocs,
  orderBy
} from 'firebase/firestore';

const AmigosPosts = () => {
  const [amigosPosts, setAmigosPosts] = useState([]);

  useEffect(() => {
    const loadAmigosPosts = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userRef = await db.collection('users').doc(user.uid).get();
      if (!userRef.exists) return;

      const { following = [] } = userRef.data();

      if (!following.length) {
        setAmigosPosts([]);
        return;
      }

      const q = query(
        collection(db, 'posts'),
        where('userId', 'in', following),
        orderBy('createdAt', 'desc')
      );

      const postDocs = await getDocs(q);
      const posts = postDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAmigosPosts(posts);
    };

    loadAmigosPosts();
  }, []);

  return (
    <div style={containerStyle}>
      <h3 style={titleStyle}>Your Amigos’ Posts</h3>
      {amigosPosts.length > 0 ? (
        <ul style={listStyle}>
          {amigosPosts.map(post => (
            <li key={post.id} style={itemStyle}>
              <p style={postContent}>{post.content || 'No content provided'}</p>
              {post.imageUrl && <img src={post.imageUrl} alt="Amigo post" style={mediaStyle} />}
              {post.videoUrl && (
                <video controls style={mediaStyle}>
                  <source src={post.videoUrl} type="video/mp4" />
                </video>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p style={noPostText}>Your amigos haven’t posted anything yet.</p>
      )}
    </div>
  );
};

const containerStyle = {
  fontFamily: 'Comfortaa, sans-serif',
  backgroundColor: '#fff0f0',
  padding: '2rem',
  borderRadius: '1.5rem',
  boxShadow: '0 5px 20px rgba(0,0,0,0.1)'
};

const titleStyle = {
  fontSize: '1.5rem',
  fontWeight: 'bold',
  color: '#FF6B6B',
  textAlign: 'center',
  marginBottom: '1rem'
};

const listStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem'
};

const itemStyle = {
  backgroundColor: '#ffecec',
  padding: '1rem',
  borderRadius: '1rem',
  boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
};

const postContent = {
  fontSize: '1rem',
  fontWeight: 'bold',
  color: '#333',
  marginBottom: '0.5rem'
};

const mediaStyle = {
  maxWidth: '100%',
  borderRadius: '1rem',
  marginTop: '0.5rem'
};

const noPostText = {
  color: '#FF6B6B',
  textAlign: 'center',
  marginTop: '1rem'
};

export default AmigosPosts;
