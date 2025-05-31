// ✅ ExploreAmigosPage – Clean Grid, Public Routing
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../../../firebase';
import { collection, query, orderBy, limit, getDocs, startAfter } from 'firebase/firestore';

const USERS_PER_PAGE = 12; // Or 15, suitable for a 3-column grid

const ExploreAmigosPage = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Start with loading true
  const [error, setError] = useState(null);
  const [lastVisible, setLastVisible] = useState(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();

  const fetchInitialUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        // Or handle appropriately if user must be logged in to see this page
        // For now, proceed but filtering might not work as expected or be needed
        console.warn("No current user found for filtering");
      }

      const usersQuery = query(
        collection(db, 'users'),
        orderBy('displayName'), // Or 'createdAt'
        limit(USERS_PER_PAGE)
      );
      const snapshot = await getDocs(usersQuery);

      if (snapshot.empty) {
        setUsers([]);
        setHasMore(false);
        setLastVisible(null);
      } else {
        const allFetchedUsers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const filteredUsers = allFetchedUsers.filter(user => user.id !== currentUser?.uid);
        setUsers(filteredUsers);
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
        setHasMore(snapshot.docs.length === USERS_PER_PAGE);
      }
    } catch (err) {
      console.error("Error fetching initial users:", err);
      setError("Failed to load amigos. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialUsers();
  }, []);

  const fetchMoreUsers = async () => {
    if (isLoadingMore || !hasMore || !lastVisible) {
      return;
    }
    setIsLoadingMore(true);
    setError(null);
    try {
      const currentUser = auth.currentUser; // Re-check, though uid shouldn't change in this context normally

      const usersQuery = query(
        collection(db, 'users'),
        orderBy('displayName'), // Must match initial query
        startAfter(lastVisible),
        limit(USERS_PER_PAGE)
      );
      const snapshot = await getDocs(usersQuery);

      if (snapshot.empty) {
        setHasMore(false);
        setLastVisible(null); // No more items, clear lastVisible
      } else {
        const newFetchedUsers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const filteredNewUsers = newFetchedUsers.filter(user => user.id !== currentUser?.uid);
        setUsers(prevUsers => [...prevUsers, ...filteredNewUsers]);
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
        setHasMore(snapshot.docs.length === USERS_PER_PAGE);
      }
    } catch (err) {
      console.error("Error fetching more users:", err);
      setError("Failed to load more amigos. Please try again.");
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 font-[Comfortaa]">
      <h2 className="text-3xl font-bold text-[#FF6B6B] mb-6 text-center">Explore Amigos</h2>

      {isLoading && <p className="text-center">Loading amigos...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!isLoading && users.length === 0 && !error && (
        <p className="text-center text-gray-500">No amigos to display yet. Check back later!</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map(user => (
          <div
            key={user.id}
            onClick={() => navigate(`/profile/${user.id}`)}
            className="bg-white rounded-xl shadow p-4 border border-[#ffe5e5] hover:shadow-lg cursor-pointer transition"
          >
            <img
              src={user.photoURL || 'https://cdn-icons-png.flaticon.com/512/847/847969.png'}
              alt="avatar"
              className="w-16 h-16 rounded-full object-cover border-2 border-[#FF6B6B] mb-3"
            />
            <h3 className="text-lg font-semibold text-[#FF6B6B]">
              {user.displayName || 'Unnamed Amigo'}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {user.bio || 'No bio provided.'}
            </p>
          </div>
        ))}
      </div>

      {hasMore && !isLoadingMore && (
        <div className="text-center mt-8">
          <button
            onClick={fetchMoreUsers}
            disabled={isLoadingMore}
            className="bg-[#FF6B6B] text-white font-bold py-2 px-4 rounded hover:bg-[#ff4f4f] transition duration-150 ease-in-out disabled:opacity-50"
          >
            {isLoadingMore ? 'Loading...' : 'Load More Amigos'}
          </button>
        </div>
      )}
      {isLoadingMore && <p className="text-center mt-4">Loading more amigos...</p>}
      {!hasMore && users.length > 0 && !isLoading && (
        <p className="text-center mt-8 text-gray-500">You've discovered all amigos!</p>
      )}
    </div>
  );
};

export default ExploreAmigosPage;
