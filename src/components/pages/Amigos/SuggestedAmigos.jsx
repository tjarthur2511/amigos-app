// ✅ SuggestedAmigos.jsx – with Inline Follow Button
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../../../firebase';
import { collection, getDocs, doc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';

const SuggestedAmigos = ({ amigosToExclude = [] }) => {
  const [suggested, setSuggested] = useState([]);
  const [followingIds, setFollowingIds] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userSnap = await getDoc(doc(db, 'users', user.uid));
      const following = userSnap.data().following || [];
      setFollowingIds(following);

      const allUsers = await getDocs(collection(db, 'users'));
      const filtered = allUsers.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(u => u.id !== user.uid && !amigosToExclude.includes(u.id));

      setSuggested(filtered);
    };
    fetchData();
  }, [amigosToExclude]);

  const toggleFollow = async (targetId) => {
    const user = auth.currentUser;
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    const newFollowing = followingIds.includes(targetId)
      ? arrayRemove(targetId)
      : arrayUnion(targetId);
    await updateDoc(userRef, { following: newFollowing });
    setFollowingIds((prev) =>
      prev.includes(targetId)
        ? prev.filter((id) => id !== targetId)
        : [...prev, targetId]
    );
  };

  return (
    <div style={containerStyle}>
      {suggested.length > 0 ? (
        <ul style={listStyle}>
          {suggested.map((user) => (
            <li key={user.id} style={itemStyle} className="flex justify-between items-center hover:bg-[#fff7f7] transition cursor-pointer">
              <div onClick={() => navigate(`/profile/${user.id}`)}>
                <p style={userName}>{user.displayName}</p>
                <p style={userDetail}>{user.email}</p>
              </div>
              <button
                onClick={() => toggleFollow(user.id)}
                className={`ml-4 text-sm px-4 py-1 rounded-full font-semibold transition duration-150 ${
                  followingIds.includes(user.id)
                    ? 'bg-gray-300 text-black hover:bg-gray-400'
                    : 'bg-[#FF6B6B] text-white hover:bg-[#e15555]'
                }`}
              >
                {followingIds.includes(user.id) ? 'Unfollow' : 'Follow'}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p style={noDataStyle}>No suggested amigos yet.</p>
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

export default SuggestedAmigos;