// ✅ AmigosUnidos - White Layout with Zero zIndex
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../../../firebase';
import { doc, getDoc, getDocs, collection } from 'firebase/firestore';

const AmigosUnidos = () => {
  const [followedAmigos, setFollowedAmigos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadFollowedAmigos = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) return;

      const { following = [] } = userSnap.data();

      const allUsersSnap = await getDocs(collection(db, 'users'));
      const amigos = allUsersSnap.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(user => following.includes(user.id));

      setFollowedAmigos(amigos);
    };

    loadFollowedAmigos();
  }, []);

  // Define reused class strings
  const titleClasses = "text-xl text-coral font-bold text-center mb-4"; // text-xl for 1.5rem approx
  const userNameClasses = "text-lg font-bold"; // text-lg for 1.2rem approx
  const userDetailClasses = "text-sm text-gray-600"; // text-sm for 0.9rem, gray-600 for #555
  const itemClasses = "bg-white p-4 rounded-xl shadow-[0_2px_6px_rgba(0,0,0,0.15)] z-0"; // rounded-xl for 1rem

  return (
    <div className="font-comfortaa bg-white p-8 rounded-[1.5rem] shadow-[0_5px_20px_rgba(0,0,0,0.1)] z-0">
      <h3 className={titleClasses}>Amigos Unidos</h3>
      {followedAmigos.length > 0 ? (
        <ul className="flex flex-col gap-4">
          {followedAmigos.map(amigo => (
            <li
              key={amigo.id}
              className={`${itemClasses} hover:bg-blush transition cursor-pointer`} // Used blush from theme
              onClick={() => navigate(`/profile/${amigo.id}`)}
            >
              <p className={userNameClasses}>{amigo.displayName}</p>
              <p className={userDetailClasses}>{amigo.email}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-coral text-center mt-4">You aren’t following any amigos yet.</p>
      )}
    </div>
  );
};

// Style object constants are no longer needed.

export default AmigosUnidos;
