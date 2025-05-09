// ✅ ProfileCard - Rounded Layout Version
import React, { useEffect, useState } from 'react';
import { auth, db } from '../../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const ProfileCard = () => {
  const [displayName, setDisplayName] = useState('');
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
        setDisplayName(data.displayName || 'Unnamed Amigo');
        setPhotoURL(data.photoURL || 'https://cdn-icons-png.flaticon.com/512/847/847969.png');
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
    const userRef = doc(db, 'users', user.uid);

    await updateDoc(userRef, {
      photoURL: url, // To be replaced with real upload later
    });
  };

  if (loading) return null;

  return (
    <div style={outerWrapper}>
      <div style={cardStyle}>
        <img
          src={photoURL}
          alt="Profile"
          style={imgStyle}
        />
        <h3 style={nameStyle}>{displayName}</h3>
        <label style={buttonStyle}>
          Change Photo
          <input type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
        </label>
      </div>
    </div>
  );
};

// ⬇️ Rounded layout lock on profile page
const outerWrapper = {
  position: 'fixed',
  top: '125px',
  left: '50px',
  zIndex: 0,
  borderRadius: '50%',
  overflow: 'hidden'
};

const cardStyle = {
  backgroundColor: '#fff',
  borderRadius: '50%',
  padding: '2rem',
  width: '260px',
  height: '260px',
  textAlign: 'center',
  boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
  fontFamily: 'Comfortaa, sans-serif',
  border: '2px solid #ffe0e0',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center'
};

const imgStyle = {
  width: '90px',
  height: '90px',
  borderRadius: '50%',
  objectFit: 'cover',
  border: '3px solid #FF6B6B',
  marginBottom: '0.75rem'
};

const nameStyle = {
  fontSize: '1.1rem',
  fontWeight: 'bold',
  color: '#FF6B6B',
  marginBottom: '0.5rem'
};

const buttonStyle = {
  display: 'inline-block',
  padding: '0.4rem 1rem',
  backgroundColor: '#FF6B6B',
  color: 'white',
  borderRadius: '9999px',
  cursor: 'pointer',
  fontSize: '0.85rem',
  marginTop: '0.25rem'
};

export default ProfileCard;
