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

  // Define reused class strings
  const titleClasses = "text-xl text-coral font-bold text-center mb-4";
  const userNameClasses = "text-lg text-coral font-bold";
  const userDetailClasses = "text-sm text-gray-600";
  const itemClasses = "bg-white p-4 rounded-xl shadow-[0_2px_6px_rgba(0,0,0,0.15)] z-0";

  return (
    <div className="bg-white p-4 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.1)] font-comfortaa z-0 mt-6">
      <h3 className={titleClasses}>Followers</h3>
      {followers.length > 0 ? (
        <ul className="flex flex-col gap-4 mt-4">
          {followers.map((f) => (
            <li
              key={f.id}
              className={`${itemClasses} hover:bg-blush transition cursor-pointer`}
              onClick={() => navigate(`/profile/${f.id}`)}
            >
              <p className={userNameClasses}>{f.displayName}</p>
              <p className={userDetailClasses}>{f.email}</p>
            </li>
          ))}
        </ul>
      ) : (
        // Changed to text-gray-600 for better contrast
        <p className="text-center text-gray-600 mt-4">No followers yet.</p>
      )}
    </div>
  );
};

export default FollowersList;
