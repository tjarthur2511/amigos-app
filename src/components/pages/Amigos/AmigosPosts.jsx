// ✅ AmigosPosts - Clean Layout, White Cards, No Background
import React, { useEffect, useState, useCallback } from 'react';
import { db, auth } from '../../../firebase';
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  startAfter
  // doc, getDoc no longer needed directly here for posts
} from 'firebase/firestore';
import PostCard from '../../common/PostCard';

const POSTS_PER_PAGE = 10;
const MAX_FOLLOWED_FOR_FEED_QUERY = 10; // Max 30, using 10 for potential performance/complexity balance

const AmigosPosts = () => {
  const [posts, setPosts] = useState([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [isLoadingMorePosts, setIsLoadingMorePosts] = useState(false);
  const [lastVisiblePost, setLastVisiblePost] = useState(null);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [error, setError] = useState(null);
  const [activeFollowedUserIdsForQuery, setActiveFollowedUserIdsForQuery] = useState([]);
  // const [allFollowedUserIds, setAllFollowedUserIds] = useState([]); // Optional: to store all for cycling chunks

  const loadInitialAmigosPosts = useCallback(async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      setPosts([]);
      setIsLoadingPosts(false);
      setHasMorePosts(false);
      return;
    }

    setIsLoadingPosts(true);
    setError(null);
    setPosts([]);
    setLastVisiblePost(null);
    setHasMorePosts(true);
    setActiveFollowedUserIdsForQuery([]);

    try {
      const followingUsersRef = collection(db, 'users', currentUser.uid, 'followingUsers');
      const followingSnapshot = await getDocs(followingUsersRef);
      const followedUserIds = followingSnapshot.docs.map(doc => doc.id);
      // setAllFollowedUserIds(followedUserIds); // Store if implementing cycling chunks

      if (followedUserIds.length === 0) {
        setPosts([]);
        setHasMorePosts(false);
        setIsLoadingPosts(false);
        return;
      }

      const currentFollowedChunk = followedUserIds.slice(0, MAX_FOLLOWED_FOR_FEED_QUERY);
      setActiveFollowedUserIdsForQuery(currentFollowedChunk);

      if (currentFollowedChunk.length === 0) {
        setPosts([]);
        setHasMorePosts(false);
        setIsLoadingPosts(false);
        return;
      }

      const postsQuery = query(
        collection(db, 'posts'),
        where('userId', 'in', currentFollowedChunk), // Posts authored by these users
        orderBy('createdAt', 'desc'),
        limit(POSTS_PER_PAGE)
      );

      const snapshot = await getDocs(postsQuery);
      const fetchedPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      setPosts(fetchedPosts);
      setLastVisiblePost(snapshot.docs[snapshot.docs.length - 1]);
      setHasMorePosts(fetchedPosts.length === POSTS_PER_PAGE);

    } catch (err) {
      console.error("Error loading initial amigos posts:", err);
      setError("Failed to load posts from your amigos. Please try again.");
      setPosts([]);
      setHasMorePosts(false);
    } finally {
      setIsLoadingPosts(false);
    }
  }, []);

  useEffect(() => {
    loadInitialAmigosPosts();
  }, [loadInitialAmigosPosts, auth.currentUser?.uid]);


  const fetchMoreAmigosPosts = async () => {
    if (isLoadingMorePosts || !hasMorePosts || !lastVisiblePost || activeFollowedUserIdsForQuery.length === 0) {
      return;
    }

    setIsLoadingMorePosts(true);
    setError(null);

    try {
      const postsQuery = query(
        collection(db, 'posts'),
        where('userId', 'in', activeFollowedUserIdsForQuery),
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
      console.error("Error fetching more amigos posts:", err);
      setError("Failed to load more posts. Please try refreshing.");
    } finally {
      setIsLoadingMorePosts(false);
    }
  };

  // Note on cycling through followed user chunks (MAX_FOLLOWED_FOR_FEED_QUERY) is omitted for brevity,
  // but similar to GruposPosts, this currently only handles the first chunk.

  // Define reused class strings
  const titleClasses = "text-xl text-coral font-bold text-center mb-4";
  // itemClasses are applied directly to PostCard or its wrapper if PostCard doesn't include full styling.
  // For this example, assuming PostCard is self-contained or the li takes care of it.
  // const itemClasses = "bg-white p-4 rounded-xl shadow-[0_2px_6px_rgba(0,0,0,0.15)] z-0";

  return (
    <div className="font-comfortaa bg-white p-8 rounded-[1.5rem] shadow-[0_5px_20px_rgba(0,0,0,0.1)] z-0">
      <h3 className={titleClasses}>Your Amigos’ Posts</h3>

      {isLoadingPosts && <p className="text-center text-gray-500 py-4">Loading amigos' posts...</p>}
      {error && <p className="text-center text-red-500 py-4">{error}</p>}

      {!isLoadingPosts && !error && posts.length === 0 && (
        <p className="text-coral text-center mt-4">
          Your amigos haven’t posted anything yet, or no posts from the current selection of amigos.
        </p>
      )}

      {posts.length > 0 && (
        <ul className="flex flex-col gap-4">
          {posts.map(post => (
            // The old itemClasses provided background and shadow. If PostCard doesn't, apply here.
            // For now, assuming PostCard is styled.
            <li key={post.id} className="bg-white p-4 rounded-xl shadow-[0_2px_6px_rgba(0,0,0,0.15)] z-0">
              <PostCard post={post} />
            </li>
          ))}
        </ul>
      )}

      {hasMorePosts && !isLoadingMorePosts && posts.length > 0 && (
        <div className="text-center mt-8">
          <button
            onClick={fetchMoreAmigosPosts}
            className="bg-coral text-white font-bold py-2 px-4 rounded-lg hover:bg-coral-dark transition duration-150 ease-in-out"
          >
            Load More Posts
          </button>
        </div>
      )}
      {isLoadingMorePosts && <p className="text-center text-gray-500 py-4">Loading more posts...</p>}
      {!hasMorePosts && posts.length > 0 && !isLoadingPosts && (
         <p className="text-center text-gray-400 py-4 italic">You've seen all posts from this selection of amigos.</p>
      )}
    </div>
  );
};

export default AmigosPosts;
