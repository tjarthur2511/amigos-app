// ✅ AmigosUnidos - White Layout with Zero zIndex
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../../../firebase';
import { collection, getDocs, query, where, documentId } from 'firebase/firestore'; // Added query, where, documentId

const AmigosUnidos = () => {
  const [followedAmigosDetails, setFollowedAmigosDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadFollowedAmigosDetails = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setFollowedAmigosDetails([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Step 2: Fetch Followed User IDs
        const followingUsersRef = collection(db, 'users', currentUser.uid, 'followingUsers');
        const followingSnapshot = await getDocs(followingUsersRef);

        const followedUserIds = followingSnapshot.docs.map(doc => doc.id);

        if (followedUserIds.length === 0) {
          setFollowedAmigosDetails([]);
          setIsLoading(false);
          return;
        }

        // Step 3: Fetch Full Profiles of Followed Users (Efficiently with Batching)
        const allFetchedUserDetails = [];
        const BATCH_SIZE = 30; // Firestore 'in' query limit

        for (let i = 0; i < followedUserIds.length; i += BATCH_SIZE) {
          const batchOfIds = followedUserIds.slice(i, i + BATCH_SIZE);
          if (batchOfIds.length > 0) {
            const usersQuery = query(collection(db, 'users'), where(documentId(), 'in', batchOfIds));
            const usersSnapshot = await getDocs(usersQuery);
            usersSnapshot.docs.forEach(doc => {
              allFetchedUserDetails.push({ id: doc.id, ...doc.data() });
            });
          }
        }
        
        // Sort alphabetically by displayName, or any other preferred order
        allFetchedUserDetails.sort((a, b) => {
          const nameA = a.displayName || '';
          const nameB = b.displayName || '';
          return nameA.localeCompare(nameB);
        });

        setFollowedAmigosDetails(allFetchedUserDetails);

      } catch (err) {
        console.error("Error loading followed amigos details:", err);
        setError("Failed to load your amigos. Please try refreshing.");
        setFollowedAmigosDetails([]); // Clear any potentially stale data
      } finally {
        setIsLoading(false);
      }
    };

    loadFollowedAmigosDetails();
  }, [auth.currentUser?.uid]); // Re-run if user ID changes

  // Define reused class strings
  const titleClasses = "text-xl text-coral font-bold text-center mb-4";
  const userNameClasses = "text-lg font-bold text-coral";
  const userDetailClasses = "text-sm text-gray-600";
  const itemClasses = "bg-white p-4 rounded-xl shadow-[0_2px_6px_rgba(0,0,0,0.15)] z-0";

  return (
    <div className="font-comfortaa bg-white p-8 rounded-[1.5rem] shadow-[0_5px_20px_rgba(0,0,0,0.1)] z-0">
      <h3 className={titleClasses}>Amigos Unidos</h3>
      {isLoading && <p className="text-center text-gray-500">Loading your amigos...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {!isLoading && !error && followedAmigosDetails.length === 0 && (
        <p className="text-gray-600 text-center mt-4">
          You aren’t following any amigos yet. Explore to connect!
        </p>
      )}
      {!isLoading && !error && followedAmigosDetails.length > 0 && (
        <ul className="flex flex-col gap-4">
          {followedAmigosDetails.map(amigo => (
            <li
              key={amigo.id}
              className={`${itemClasses} hover:bg-blush transition cursor-pointer`}
              onClick={() => navigate(`/profile/${amigo.id}`)}
            >
              <p className={userNameClasses}>{amigo.displayName || 'Unnamed Amigo'}</p>
              <p className={userDetailClasses}>{amigo.email || 'No email provided'}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AmigosUnidos;
