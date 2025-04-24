import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import './ProfilePage.css';

const mockUserId = 'user123'; // Replace with actual auth ID when auth is connected

function ProfilePage() {
  const [profilePic, setProfilePic] = useState(null);
  const [language, setLanguage] = useState('');
  const [location, setLocation] = useState('');
  const [weeklyAnswer, setWeeklyAnswer] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const docRef = doc(db, 'users', mockUserId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setLanguage(data.language || '');
        setLocation(data.location || '');
        setWeeklyAnswer(data.weeklyAnswer || '');
        setProfilePic(data.profilePhotoUrl || null);
      }
    };
    fetchProfile();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfilePic(imageUrl);

      // Optional: Upload to storage + update Firestore later
      await setDoc(doc(db, 'users', mockUserId), {
        profilePhotoUrl: imageUrl,
      }, { merge: true });
    }
  };

  const saveChanges = async () => {
    await setDoc(doc(db, 'users', mockUserId), {
      language,
      location,
    }, { merge: true });
    setIsEditing(false);
  };

  return (
    <div className="profile-container">
      <h2 tabIndex="0">Your Profile</h2>

      <div className="profile-section">
        <label htmlFor="profile-pic-upload" className="profile-pic-label" aria-label="Upload profile picture">
          {profilePic ? (
            <img src={profilePic} alt="Profile" className="profile-pic" />
          ) : (
            <span className="placeholder-pic">Upload Photo</span>
          )}
          <input
            id="profile-pic-upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            aria-label="Upload profile image"
          />
        </label>

        <div className="profile-info">
          {isEditing ? (
            <>
              <label htmlFor="language-select">Preferred Language:</label>
              <select id="language-select" value={language} onChange={(e) => setLanguage(e.target.value)}>
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
              </select>

              <label htmlFor="location-input">Location:</label>
              <input
                id="location-input"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />

              <button onClick={saveChanges}>Save</button>
            </>
          ) : (
            <>
              <p><strong>Preferred Language:</strong> {language}</p>
              <p><strong>Location:</strong> {location}</p>
              <p><strong>Weekly Answer:</strong> {weeklyAnswer}</p>
              <button onClick={() => setIsEditing(true)}>Edit</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
