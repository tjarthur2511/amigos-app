// 💖 ProfilePhotos - Optimized Layout for Visual Appeal & User Retention
import React, { useEffect, useState } from 'react';
import { db, auth } from '../../../firebase';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';

const ProfilePhotos = () => {
  const [photoPosts, setPhotoPosts] = useState([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, 'posts'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const photos = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(post => !!post.imageUrl);
      setPhotoPosts(photos);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div style={wrapperStyle}>
      <h2 style={headlineStyle}>📸 Your Photo Gallery</h2>
      {photoPosts.length > 0 ? (
        <div style={gridStyle}>
          {photoPosts.map(post => (
            <div key={post.id} style={photoCard}>
              <img
                src={post.imageUrl}
                alt="Post"
                style={imageStyle}
              />
            </div>
          ))}
        </div>
      ) : (
        <p style={emptyMessage}>You haven't posted any photos yet.</p>
      )}
    </div>
  );
};

const wrapperStyle = {
  fontFamily: 'Comfortaa, sans-serif',
  padding: '2rem',
  background: 'linear-gradient(to bottom right, #ffffff, #fff0f0)',
  borderRadius: '2rem',
  boxShadow: '0 15px 30px rgba(255,107,107,0.15)',
  animation: 'fadeIn 0.6s ease-out',
};

const headlineStyle = {
  fontSize: '1.6rem',
  color: '#FF6B6B',
  textAlign: 'center',
  marginBottom: '1.5rem',
  textShadow: '0 0 4px rgba(255,107,107,0.3)'
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
  gap: '1.75rem',
};

const photoCard = {
  borderRadius: '1.25rem',
  overflow: 'hidden',
  boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
  border: '2px solid #ffe0e0',
  transition: 'transform 0.3s ease',
};

const imageStyle = {
  width: '100%',
  height: '170px',
  objectFit: 'cover',
  display: 'block',
  borderRadius: '0.75rem',
};

const emptyMessage = {
  color: '#FF6B6B',
  textAlign: 'center',
  fontSize: '1rem',
  marginTop: '1rem',
};

export default ProfilePhotos;

// 🌟 Add this to global CSS
/*
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
*/