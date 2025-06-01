// src/components/pages/Grupos/ExploreGruposPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../../firebase';
import { collection, getDocs, query, orderBy, limit, startAfter } from 'firebase/firestore';

const GROUPS_PER_PAGE = 9; // Or 12, as per suggestion

const ExploreGruposPage = () => {
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // For initial load
  const [error, setError] = useState(null);
  const [lastVisible, setLastVisible] = useState(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialGroups = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const groupsQuery = query(
          collection(db, 'grupos'),
          orderBy('name'), // Assuming ordering by name, can be createdAt or other field
          limit(GROUPS_PER_PAGE)
        );
        const snapshot = await getDocs(groupsQuery);
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setGroups(list);
        if (snapshot.docs.length > 0) {
          setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
          setHasMore(list.length === GROUPS_PER_PAGE);
        } else {
          setLastVisible(null);
          setHasMore(false);
        }
      } catch (err) {
        console.error("Error fetching initial groups:", err);
        setError("Failed to load groups. Please try again later.");
      }
      setIsLoading(false);
    };
    fetchInitialGroups();
  }, []);

  const fetchMoreGroups = async () => {
    if (isLoadingMore || !hasMore) {
      return;
    }
    setIsLoadingMore(true);
    setError(null);
    try {
      const groupsQuery = query(
        collection(db, 'grupos'),
        orderBy('name'), // Ensure this matches the initial query's orderBy
        startAfter(lastVisible),
        limit(GROUPS_PER_PAGE)
      );
      const snapshot = await getDocs(groupsQuery);
      const newGroups = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setGroups(prevGroups => [...prevGroups, ...newGroups]);

      if (snapshot.docs.length > 0) {
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
        setHasMore(newGroups.length === GROUPS_PER_PAGE);
      } else {
        setLastVisible(null); // Should not happen if hasMore was true, but good for safety
        setHasMore(false);
      }
    } catch (err) {
      console.error("Error fetching more groups:", err);
      setError("Failed to load more groups. Please try again later.");
      // Optionally, set hasMore to false or handle retries
    }
    setIsLoadingMore(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 font-[Comfortaa]">
      <h2 className="text-3xl font-bold text-[#FF6B6B] mb-6 text-center">Explore Grupos</h2>

      {isLoading && <p className="text-center">Loading groups...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => (
          <div
            key={group.id}
            className="bg-white rounded-xl shadow p-4 border border-[#ffe5e5] hover:shadow-md cursor-pointer"
            onClick={() => navigate(`/grupos/${group.id}`)}
          >
            <h3 className="text-lg font-semibold text-[#FF6B6B]">
              {group.name || 'Unnamed Group'}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {group.description || 'No description provided'}
            </p>
          </div>
        ))}
      </div>

      {/* Button to load more groups - UI for this will be handled in a separate subtask if needed */}
      {hasMore && !isLoadingMore && (
        <div className="text-center mt-8">
          <button
            onClick={fetchMoreGroups}
            className="bg-[#FF6B6B] text-white font-bold py-2 px-4 rounded hover:bg-[#ff4f4f] transition duration-150 ease-in-out"
          >
            Load More
          </button>
        </div>
      )}
      {isLoadingMore && <p className="text-center mt-4">Loading more groups...</p>}
      {!hasMore && groups.length > 0 && <p className="text-center mt-8 text-gray-500">You've reached the end!</p>}
      {!hasMore && groups.length === 0 && !isLoading && <p className="text-center mt-8 text-gray-500">No groups found.</p>}
    </div>
  );
};

export default ExploreGruposPage;
