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
  const titleClasses = "text-xl text-coral font-bold text-center mb-4"; // text-xl for 1.5rem approx
  const userNameClasses = "text-lg text-coral font-bold"; // text-lg for 1.2rem approx
  const userDetailClasses = "text-sm text-gray-600"; // text-sm for 0.9rem, gray-600 for #555
  const itemClasses = "bg-white p-4 rounded-xl shadow-[0_2px_6px_rgba(0,0,0,0.15)] z-0"; // rounded-xl for 1rem

  return (
    <div className="bg-white p-4 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.1)] font-comfortaa z-0 mt-6"> {/* Added mt-6 for spacing */}
      <h3 className={titleClasses}>Followers</h3>
      {followers.length > 0 ? (
        <ul className="flex flex-col gap-4 mt-4">
          {followers.map((f) => (
            <li
              key={f.id}
              className={`${itemClasses} hover:bg-blush transition cursor-pointer`} // Used blush from theme
              onClick={() => navigate(`/profile/${f.id}`)}
            >
              <p className={userNameClasses}>{f.displayName}</p>
              <p className={userDetailClasses}>{f.email}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-coral mt-4">No followers yet.</p>
      )}
    </div>
  );
};

// Style object constants are no longer needed.

export default FollowersList;
