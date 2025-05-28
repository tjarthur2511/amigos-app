// src/components/pages/ProfilePage/FollowersList.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFollowers } from '../../../utils/followersUtils.js';

const FollowersList = ({ userId }) => {
  const [followers, setFollowers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadFollowers = async () => {
      const list = await getFollowers(userId);
      setFollowers(list);
    };
    loadFollowers();
  }, [userId]);

  return (
    <div style={containerStyle}>
      <h3 style={titleStyle}>Followers</h3>
      {followers.length > 0 ? (
        <ul style={listStyle}>
          {followers.map((f) => (
            <li
              key={f.id}
              style={itemStyle}
              onClick={() => navigate(`/profile/${f.id}`)}
              className="hover:bg-[#fff7f7] transition cursor-pointer"
            >
              <p style={userName}>{f.displayName}</p>
              <p style={userDetail}>{f.email}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p style={noDataStyle}>No followers yet.</p>
      )}
    </div>
  );
};

const containerStyle = {
  backgroundColor: '#ffffff',
  padding: '1rem',
  borderRadius: '1rem',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  fontFamily: 'Comfortaa, sans-serif',
  zIndex: 0
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
  gap: '1rem',
  marginTop: '1rem'
};

const itemStyle = {
  backgroundColor: '#ffffff',
  padding: '1rem',
  borderRadius: '1rem',
  boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
  zIndex: 0
};

const userName = {
  fontSize: '1.2rem',
  fontWeight: 'bold',
  color: '#FF6B6B'
};

const userDetail = {
  fontSize: '0.9rem',
  color: '#555'
};

const noDataStyle = {
  textAlign: 'center',
  color: '#FF6B6B',
  marginTop: '1rem'
};

export default FollowersList;
