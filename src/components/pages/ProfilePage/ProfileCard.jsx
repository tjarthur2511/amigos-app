// 🧬 ProfileCard - Year 3000 Hybrid Orb UI (Clean + Futuristic)
import React, { useEffect, useState } from 'react';
import { auth, db } from '../../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';

const ProfileCard = () => {
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
      photoURL: url,
    });
  };

  if (loading) return null;

  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, right: window.innerWidth, top: 0, bottom: window.innerHeight }}
      style={outerWrapper}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.97 }}
    >
      <div style={cardStyle}>
        <label htmlFor="photoUpload" style={imgWrapper}>
          <img
            src={photoURL}
            alt="Amigo Avatar"
            style={imgStyle}
          />
        </label>
        <input
          type="file"
          id="photoUpload"
          accept="image/*"
          onChange={handlePhotoChange}
          style={{ display: 'none' }}
        />
        <div style={haloRing}></div>
        <div style={orbAura}></div>
      </div>
    </motion.div>
  );
};

const outerWrapper = {
  position: 'absolute',
  top: '20px',
  left: '20px',
  cursor: 'grab',
  zIndex: 100,
};

const cardStyle = {
  position: 'relative',
  borderRadius: '50%',
  width: '180px',
  height: '180px',
  background: 'radial-gradient(circle at 30% 30%, #ffffff 0%, #ffeaea 100%)',
  border: '2px solid #ff6b6b22',
  boxShadow: '0 0 30px #ffb3b3, 0 0 60px rgba(255,107,107,0.25)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backdropFilter: 'blur(8px)',
  transition: 'all 0.3s ease-in-out',
};

const imgWrapper = {
  width: '140px',
  height: '140px',
  borderRadius: '50%',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 2,
  boxShadow: '0 0 12px rgba(255,107,107,0.4)',
};

const imgStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'transform 0.3s ease-in-out',
};

const haloRing = {
  position: 'absolute',
  width: '200px',
  height: '200px',
  borderRadius: '50%',
  boxShadow: '0 0 20px #ff6b6b, 0 0 40px #ff9999, 0 0 60px #ffc0c0',
  animation: 'pulse 4s infinite ease-in-out',
  zIndex: 1,
};

const orbAura = {
  position: 'absolute',
  width: '100%',
  height: '100%',
  borderRadius: '50%',
  background: 'radial-gradient(circle, rgba(255,107,107,0.12) 0%, transparent 70%)',
  zIndex: 0,
  filter: 'blur(12px)',
};

export default ProfileCard;

// 💫 Add this to your global CSS
/*
@keyframes pulse {
  0% { box-shadow: 0 0 20px #ff6b6b, 0 0 40px #ff9999, 0 0 60px #ffc0c0; }
  50% { box-shadow: 0 0 30px #ff6b6b, 0 0 60px #ffb3b3, 0 0 90px #ffdcdc; }
  100% { box-shadow: 0 0 20px #ff6b6b, 0 0 40px #ff9999, 0 0 60px #ffc0c0; }
}
*/
