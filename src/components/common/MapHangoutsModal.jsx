// ✅ SuggestedGrupos.jsx - White Cards, Clean Layout, zIndex 0
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../../../firebase';
import { collection, getDocs, doc, getDoc, query, where, orderBy, limit } from 'firebase/firestore';

const CANDIDATE_POOL_LIMIT = 50;
const MAX_DISPLAY_SUGGESTIONS = 5;
const MAX_TAGS_FOR_QUERY = 10; // Firestore 'array-contains-any' limit

const SuggestedGrupos = ({ gruposToExclude = [] }) => {
  const [suggestedGrupos, setSuggestedGrupos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchAndFilterSuggestions = useCallback(async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      setSuggestedGrupos([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const userSnap = await getDoc(userRef);
      
      let userTags = [];
      let userLocationState = null;
      let blockedGrupos = [];

      if (userSnap.exists()) {
        const userData = userSnap.data();
        userTags = userData.interestTags || [];
        userLocationState = userData.location?.state || null;
        blockedGrupos = userData.blockedGrupos || [];
      }

      let queryConstraints = [orderBy('createdAt', 'desc'), limit(CANDIDATE_POOL_LIMIT)];
      
      // Build query based on user data
      // Note: Firestore requires composite indexes for queries combining orderBy with multiple/different where clauses.
      if (userLocationState && userTags.length > 0) {
        // If both exist, prioritize location and then hope tags match within that.
        // Or, could do two separate queries and merge/rank, but that's more complex.
        // For simplicity, this query might be too restrictive or require specific indexing.
        // A common approach is to query on one primary aspect (e.g., location) and filter the other client-side,
        // or use 'array-contains-any' for tags and filter location client-side if tag matching is broader.
        // Given Firestore limits, let's try with location and tags if both present.
        queryConstraints.unshift(where('location.state', '==', userLocationState));
        queryConstraints.unshift(where('tags', 'array-contains-any', userTags.slice(0, MAX_TAGS_FOR_QUERY)));
      } else if (userLocationState) {
        queryConstraints.unshift(where('location.state', '==', userLocationState));
      } else if (userTags.length > 0) {
        queryConstraints.unshift(where('tags', 'array-contains-any', userTags.slice(0, MAX_TAGS_FOR_QUERY)));
      }
      // If neither, it defaults to recently created groups.

      const finalQuery = query(collection(db, 'grupos'), ...queryConstraints);
      const snapshot = await getDocs(finalQuery);
      const candidateGrupos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Client-side filtering
      const filteredSuggestions = candidateGrupos.filter(grupo =>
        !gruposToExclude.includes(grupo.id) &&
        !blockedGrupos.includes(grupo.id)
      );
      
      // Additional client-side scoring/ranking could be done here if needed.
      // For example, prefer groups that match more tags or are also in the same city (if state was the primary geo filter).

      setSuggestedGrupos(filteredSuggestions.slice(0, MAX_DISPLAY_SUGGESTIONS));

    } catch (err) {
      console.error("Error fetching suggested grupos:", err);
      setError("Could not load suggestions. Please try again later.");
      setSuggestedGrupos([]);
    } finally {
      setIsLoading(false);
    }
  }, [gruposToExclude, auth.currentUser?.uid]); // Dependency on currentUser.uid

  useEffect(() => {
    fetchAndFilterSuggestions();
  }, [fetchAndFilterSuggestions]);
  
  // Tailwind CSS classes (replaces style objects)
  const containerClasses = "bg-white p-4 sm:p-6 rounded-xl shadow-lg font-comfortaa z-0";
  const titleClasses = "text-xl sm:text-2xl text-coral font-bold text-center mb-4";
  const scrollBoxClasses = "max-h-[300px] sm:max-h-[400px] overflow-y-auto mt-4 pr-2 space-y-3"; // Added space-y for gap
  const itemClasses = "bg-gray-50 p-3 sm:p-4 rounded-lg shadow-md hover:bg-coral-blush transition-colors duration-150 ease-in-out cursor-pointer";
  const groupNameClasses = "text-md sm:text-lg font-semibold text-coral";
  const groupDetailClasses = "text-xs sm:text-sm text-gray-600 line-clamp-2"; // line-clamp for long descriptions
  const noDataMessageClasses = "text-center text-gray-500 py-4";


  if (isLoading) {
    return (
      <div className={containerClasses}>
        <h3 className={titleClasses}>Suggested Grupos</h3>
        <p className={noDataMessageClasses}>Loading suggestions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={containerClasses}>
        <h3 className={titleClasses}>Suggested Grupos</h3>
        <p className={`text-center text-red-500 py-4`}>{error}</p>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      <h3 className={titleClasses}>Suggested Grupos</h3>
      {suggestedGrupos.length > 0 ? (
        <div className={scrollBoxClasses}>
          <ul className="list-none p-0 m-0"> {/* Removed listStyle equivalent as space-y on parent is better */}
            {suggestedGrupos.map(grupo => (
              <li
                key={grupo.id}
                className={itemClasses}
                onClick={() => navigate(`/grupos/${grupo.id}`)}
              >
                <p className={groupNameClasses}>{grupo.name || "Unnamed Grupo"}</p>
                <p className={groupDetailClasses}>{grupo.description || "No description."}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className={noDataMessageClasses}>No suggested grupos for you right now. Explore more to get suggestions!</p>
      )}
    </div>
  );
};

export default SuggestedGrupos;
