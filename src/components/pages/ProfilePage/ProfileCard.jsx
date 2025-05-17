import React, { useEffect, useState } from 'react';
import { auth, db } from '../../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const ProfileCard = ({ top = '15px', left = '40px' }) => {
  const [photoURL, setPhotoURL] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(db, 'users', user.uid);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        const data = snap.data();
        setPhotoURL(data.photoURL || '');
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPhotoURL(url);

    const user = auth.currentUser;
    if (!user) return;

    await updateDoc(doc(db, 'users', user.uid), {
      photoURL: url,
    });
  };

  if (loading) return null;

  return (
    <div style={{ ...positionWrapper(top, left) }}>
      <div style={avatarBox}>
        <label htmlFor="upload-photo" style={uploadLabel}>
          <img
            src={photoURL || '/assets/default-avatar.png'}
            alt="Your Avatar"
            style={avatarImage}
          />
          <span style={editOverlay}>📷 Edit</span>
        </label>
        <input
          type="file"
          id="upload-photo"
          accept="image/*"
          onChange={handlePhotoChange}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
};

const positionWrapper = (top, left) => ({
  position: 'absolute',
  top,
  left,
  zIndex: 90,
});

const avatarBox = {
  width: '140px',
  height: '140px',
  borderRadius: '50%',
  overflow: 'hidden',
  boxShadow: '0 0 0 4px #e15555',
  backgroundColor: '#fff',
  transition: 'box-shadow 0.3s ease',
};

const avatarImage = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  borderRadius: '50%',
};

const uploadLabel = {
  cursor: 'pointer',
  display: 'block',
  width: '100%' ,
  height: '100%' ,
  position: 'relative',
};

const editOverlay = {
  position: 'absolute',
  bottom: 0,
  width: '100%',
  backgroundColor: '#e15555',
  color: 'white',
  fontSize: '0.75rem',
  padding: '0.3rem 0',
  textAlign: 'center',
  opacity: 0.95,
  borderTop: '1px solid #fff',
  pointerEvents: 'none' ,
};

export default ProfileCard;
