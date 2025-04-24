import React, { useState } from 'react';
import './ProfilePage.css';

function ProfilePage() {
  const [profilePic, setProfilePic] = useState(null);
  const [language, setLanguage] = useState('English');
  const [location, setLocation] = useState('Detroit, MI');
  const [weeklyAnswer, setWeeklyAnswer] = useState('Exploring local trails');

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(URL.createObjectURL(file));
    }
  };

  return (
    <div className="profile-container">
      <h2>Your Profile</h2>

      <div className="profile-section">
        <label className="profile-pic-label">
          {profilePic ? (
            <img src={profilePic} alt="Profile" className="profile-pic" />
          ) : (
            <span className="placeholder-pic">Upload Photo</span>
          )}
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        </label>

        <div className="profile-info">
          <p><strong>Preferred Language:</strong> {language}</p>
          <p><strong>Location:</strong> {location}</p>
          <p><strong>Question of the Week:</strong> {weeklyAnswer}</p>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
