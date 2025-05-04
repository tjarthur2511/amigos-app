// src/components/pages/ProfilePage/ProfilePreferences.jsx
import React, { useEffect, useState } from 'react';
import { db, auth } from '../../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const ProfilePreferences = () => {
  const [language, setLanguage] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchPreferences = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        setLanguage(data.language || '');
        setLocation(data.location || '');
      }
    };

    fetchPreferences();
  }, []);

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    try {
      await updateDoc(userRef, { language, location });
      setStatus('Preferences updated!');
      setTimeout(() => setStatus(''), 2000);
    } catch (err) {
      console.error('Update failed:', err);
      setStatus('Failed to update.');
    }
  };

  return (
    <div style={cardStyle}>
      <h3 style={titleStyle}>Your Preferences</h3>
      <label style={labelStyle}>Preferred Language:</label>
      <input
        type="text"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        style={inputStyle}
        placeholder="e.g. English"
      />
      <label style={labelStyle}>Location:</label>
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        style={inputStyle}
        placeholder="e.g. Detroit, MI"
      />
      <button onClick={handleSave} style={buttonStyle}>Save</button>
      {status && <p style={statusStyle}>{status}</p>}
    </div>
  );
};

const cardStyle = {
  backgroundColor: '#fff0f0',
  padding: '1.5rem',
  borderRadius: '1rem',
  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  fontFamily: 'Comfortaa, sans-serif',
  textAlign: 'center',
};

const titleStyle = {
  fontSize: '1.5rem',
  marginBottom: '1rem',
  color: '#FF6B6B'
};

const labelStyle = {
  display: 'block',
  marginTop: '1rem',
  fontWeight: 'bold',
  color: '#444',
};

const inputStyle = {
  width: '100%',
  padding: '0.5rem',
  marginTop: '0.3rem',
  borderRadius: '8px',
  border: '1px solid #ccc',
  fontFamily: 'Comfortaa, sans-serif'
};

const buttonStyle = {
  marginTop: '1.5rem',
  backgroundColor: '#FF6B6B',
  color: 'white',
  padding: '0.5rem 1.5rem',
  border: 'none',
  borderRadius: '999px',
  cursor: 'pointer'
};

const statusStyle = {
  marginTop: '1rem',
  color: '#FF6B6B',
  fontWeight: 'bold'
};

export default ProfilePreferences;
