import React, { useEffect, useState } from 'react';
import { db, auth } from '../../../firebase';
import {
  collection,
  query,
  where,
  getDocs,
  orderBy
} from 'firebase/firestore';
import PostCard from '../../common/PostCard';

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

      const postSnap = await getDocs(
        query(collection(db, 'posts'), orderBy('createdAt', 'desc'))
      );

      const allPosts = postSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const filtered = allPosts.filter(post =>
        Array.isArray(post.taggedAmigos) &&
        post.taggedAmigos.some(tagged => following.includes(tagged))
      );

      setAmigosPosts(filtered);
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
              <PostCard post={post} />
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

const noPostText = {
  color: '#FF6B6B',
  textAlign: 'center',
  marginTop: '1rem'
};

export default AmigosPosts;
