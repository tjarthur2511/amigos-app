// ✅ SuggestedAmigos.jsx – with Inline Follow Button
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../../../firebase';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
} from 'firebase/firestore';

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

  // Tailwind class constants
  const userNameClasses = "text-lg text-coral font-bold";
  const userDetailClasses = "text-sm text-gray-600";
  const itemClasses = "bg-white p-4 rounded-xl shadow-[0_2px_6px_rgba(0,0,0,0.15)] z-0";

  return (
    <div className="bg-white p-4 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.1)] font-comfortaa z-0">
      {suggested.length > 0 ? (
        <ul className="flex flex-col gap-4 mt-4">
          {suggested.map((user) => (
            <li
              key={user.id}
              className={`${itemClasses} flex justify-between items-center hover:bg-blush transition cursor-pointer`}
            >
              <div onClick={() => navigate(`/profile/${user.id}`)} className="flex-grow">
                <p className={userNameClasses}>{user.displayName}</p>
                <p className={userDetailClasses}>{user.email}</p>
              </div>
              <button
                onClick={() => toggleFollow(user.id)}
                className={`ml-4 text-sm px-4 py-2 rounded-full font-comfortaa font-bold shadow-md transition-all duration-200 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed ${
                  followingIds.includes(user.id)
                    ? 'bg-coral-dark text-white hover:bg-coral'
                    : 'bg-coral text-white hover:bg-coral-dark'
                }`}
              >
                {followingIds.includes(user.id) ? 'Unfollow' : 'Follow'}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-600 mt-4">
          No suggested amigos yet.
        </p>
      )}
    </div>
  );
};

export default SuggestedAmigos;
