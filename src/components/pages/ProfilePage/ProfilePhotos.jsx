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
        .filter(post => !!post.imageUrl); // filter images manually
      setPhotoPosts(photos);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div style={{
      fontFamily: 'Comfortaa, sans-serif',
      padding: '1rem',
      backgroundColor: '#fff0f0',
      borderRadius: '1rem',
      boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
    }}>
      {photoPosts.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: '1rem'
        }}>
          {photoPosts.map(post => (
            <div key={post.id} style={{
              borderRadius: '1rem',
              overflow: 'hidden',
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
              transition: 'transform 0.2s ease',
              border: '2px solid transparent',
            }}>
              <img
                src={post.imageUrl}
                alt="Post"
                style={{
                  width: '100%',
                  height: '150px',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </div>
          ))}
        </div>
      ) : (
        <p style={{ color: '#FF6B6B', textAlign: 'center', marginTop: '1rem' }}>
          You haven't posted any photos yet.
        </p>
      )}
    </div>
  );
};

export default ProfilePhotos;
