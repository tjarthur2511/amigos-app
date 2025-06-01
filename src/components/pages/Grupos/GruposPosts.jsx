// ✅ GruposPosts - Clean White Card Layout, zIndex 0
import React, { useEffect, useState, useCallback } from 'react';
import { db, auth } from '../../../firebase';
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  limit,
  startAfter,
  documentId // Added documentId for potential use, though not in this exact query
} from 'firebase/firestore';
import PostCard from '../../common/PostCard'; // Assuming PostCard handles its own internal styling

const POSTS_PER_PAGE = 10;
const MAX_GROUPS_FOR_FEED_QUERY = 10; // Firestore 'in' query limit is 30, using 10 for safety/performance.

const GruposPosts = () => {
  const [posts, setPosts] = useState([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [isLoadingMorePosts, setIsLoadingMorePosts] = useState(false);
  const [lastVisiblePost, setLastVisiblePost] = useState(null);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [error, setError] = useState(null);
  const [activeGroupIdsForQuery, setActiveGroupIdsForQuery] = useState([]);
  const [allJoinedGroupIds, setAllJoinedGroupIds] = useState([]); // To store all joined group IDs

  const loadInitialData = useCallback(async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      setPosts([]);
      setIsLoadingPosts(false);
      setHasMorePosts(false);
      return;
    }

    setIsLoadingPosts(true);
    setError(null);
    setPosts([]); // Clear previous posts on new initial load
    setLastVisiblePost(null);
    setHasMorePosts(true);

    try {
      const memberOfGruposRef = collection(db, 'users', currentUser.uid, 'memberOfGrupos');
      const memberOfSnapshot = await getDocs(memberOfGruposRef);
      const groupIds = memberOfSnapshot.docs.map(doc => doc.id);
      setAllJoinedGroupIds(groupIds); // Store all for potential future use (e.g. cycling through group chunks)

      if (groupIds.length === 0) {
        setPosts([]);
        setHasMorePosts(false);
        setIsLoadingPosts(false);
        setActiveGroupIdsForQuery([]);
        return;
      }

      const currentGroupChunk = groupIds.slice(0, MAX_GROUPS_FOR_FEED_QUERY);
      setActiveGroupIdsForQuery(currentGroupChunk);

      if (currentGroupChunk.length === 0) {
        // This case should ideally not be hit if groupIds.length > 0, but as a safeguard:
        setPosts([]);
        setHasMorePosts(false);
        setIsLoadingPosts(false);
        return;
      }

      const postsQuery = query(
        collection(db, 'posts'),
        where('grupoId', 'in', currentGroupChunk),
        orderBy('createdAt', 'desc'),
        limit(POSTS_PER_PAGE)
      );

      const snapshot = await getDocs(postsQuery);
      const fetchedPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      setPosts(fetchedPosts);
      setLastVisiblePost(snapshot.docs[snapshot.docs.length - 1]);
      setHasMorePosts(fetchedPosts.length === POSTS_PER_PAGE);

    } catch (err) {
      console.error("Error loading initial posts:", err);
      setError("Failed to load posts from your grupos. Please try again.");
      setPosts([]);
      setHasMorePosts(false);
    } finally {
      setIsLoadingPosts(false);
    }
  }, []); // useCallback dependencies are empty as it's meant to be stable or re-called via key change / manual refresh

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData, auth.currentUser?.uid]); // Depend on currentUser.uid to re-fetch if user changes


  const fetchMorePosts = async () => {
    if (isLoadingMorePosts || !hasMorePosts || !lastVisiblePost || activeGroupIdsForQuery.length === 0) {
      return;
    }

    setIsLoadingMorePosts(true);
    setError(null);

    try {
      const postsQuery = query(
        collection(db, 'posts'),
        where('grupoId', 'in', activeGroupIdsForQuery),
        orderBy('createdAt', 'desc'),
        startAfter(lastVisiblePost),
        limit(POSTS_PER_PAGE)
      );

      const snapshot = await getDocs(postsQuery);
      const newPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      setPosts(prevPosts => [...prevPosts, ...newPosts]);
      setLastVisiblePost(snapshot.docs[snapshot.docs.length - 1]);
      setHasMorePosts(newPosts.length === POSTS_PER_PAGE);

    } catch (err) {
      console.error("Error fetching more posts:", err);
      setError("Failed to load more posts. Please try refreshing.");
      // Optionally set hasMorePosts to false here or allow retry
    } finally {
      setIsLoadingMorePosts(false);
    }
  };

  // Note: The logic for cycling through `allJoinedGroupIds` if it exceeds `MAX_GROUPS_FOR_FEED_QUERY`
  // (i.e., fetching posts from the *next* chunk of groups) is not implemented here as it adds
  // significant complexity beyond typical pagination of items within a fixed query.
  // This component will currently only show posts from the first `MAX_GROUPS_FOR_FEED_QUERY` groups.

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl font-comfortaa z-0">
      <h3 className="text-2xl text-coral font-bold text-center mb-6">
        Posts from Your Grupos
      </h3>

      {isLoadingPosts && <p className="text-center text-gray-500 py-4">Loading posts...</p>}
      {error && <p className="text-center text-red-500 py-4">{error}</p>}

      {!isLoadingPosts && !error && posts.length === 0 && (
        <p className="text-center text-coral py-4">
          No posts found in your followed grupos yet.
        </p>
      )}

      {posts.length > 0 && (
        <ul className="flex flex-col gap-4">
          {posts.map(post => (
            // Assuming PostCard handles its own styling and is a block-level element or styled appropriately.
            // The li here is mostly for list semantics and keying.
            <li key={post.id}>
              <PostCard post={post} />
            </li>
          ))}
        </ul>
      )}

      {hasMorePosts && !isLoadingMorePosts && posts.length > 0 && (
        <div className="text-center mt-8">
          <button
            onClick={fetchMorePosts}
            className="bg-coral text-white font-bold py-2 px-4 rounded-lg hover:bg-coral-dark transition duration-150 ease-in-out"
          >
            Load More Posts
          </button>
        </div>
      )}
      {isLoadingMorePosts && <p className="text-center text-gray-500 py-4">Loading more posts...</p>}
      {!hasMorePosts && posts.length > 0 && !isLoadingPosts && (
         <p className="text-center text-gray-400 py-4 italic">You've seen all posts from these grupos.</p>
      )}
    </div>
  );
};

export default GruposPosts;
