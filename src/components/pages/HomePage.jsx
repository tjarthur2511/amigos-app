// ✅ Final Full HomePage.jsx with Logo-Nav Spacing Tightened (No Code Removed)
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../../firebase';
import {
  collection,
  onSnapshot,
  query,
  doc,
  updateDoc,
  getDocs,
  addDoc,
  where,
  orderBy,
  Timestamp,
  deleteDoc,
  limit, // Import limit
  startAfter, // Import startAfter
} from 'firebase/firestore';
import PostDetailModal from '../common/PostDetailModal';
import FallingAEffect from '../common/FallingAEffect';
import ConfirmationModal from '../common/ConfirmationModal'; // Import ConfirmationModal
import Spinner from '../common/Spinner'; // Import Spinner

const emojiOptions = ['👍', '👎', '😂', '😢', '😮', '😡', '😍', '👏', '🔥', '🎉', '🤔', '💯'];

const HomePage = () => {
  const navigate = useNavigate();
  const [feedItems, setFeedItems] = useState([]);
  const [commentsMap, setCommentsMap] = useState({});
  const [activePicker, setActivePicker] = useState(null);
  const [activeCommentPicker, setActiveCommentPicker] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmModalProps, setConfirmModalProps] = useState({});
  const [isPostingComment, setIsPostingComment] = useState({}); // For comment posting loading state
  const [lastVisiblePost, setLastVisiblePost] = useState(null); // For pagination
  const [loadingMorePosts, setLoadingMorePosts] = useState(false); // For pagination loading state
  const [hasMorePosts, setHasMorePosts] = useState(true); // To hide/disable load more button

  const POSTS_PER_PAGE = 10; // Define page size

  // Initial posts fetch
  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    setLoadingMorePosts(true);
    const firstBatchQuery = query(
      collection(db, 'posts'),
      orderBy('createdAt', 'desc'),
      limit(POSTS_PER_PAGE)
    );

    const unsubscribe = onSnapshot(firstBatchQuery, async (snapshot) => {
      if (snapshot.empty) {
        setFeedItems([]);
        setLastVisiblePost(null);
        setHasMorePosts(false);
        setLoadingMorePosts(false);
        setCommentsMap({});
        return;
      }
      
      const newPosts = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((post) => post.createdAt);
      
      setFeedItems(newPosts);
      setLastVisiblePost(snapshot.docs[snapshot.docs.length - 1]);
      setHasMorePosts(snapshot.docs.length === POSTS_PER_PAGE);

      const newCommentsMap = {};
      for (const post of newPosts) {
        newCommentsMap[post.id] = await fetchRecentComments(post.id);
      }
      setCommentsMap(newCommentsMap);
      setLoadingMorePosts(false);
    });

    return () => unsubscribe();
  }, []);

  const fetchMorePosts = async () => {
    if (!lastVisiblePost || !hasMorePosts) return;

    setLoadingMorePosts(true);
    const nextBatchQuery = query(
      collection(db, 'posts'),
      orderBy('createdAt', 'desc'),
      startAfter(lastVisiblePost),
      limit(POSTS_PER_PAGE)
    );

    try {
      const snapshot = await getDocs(nextBatchQuery);
      if (snapshot.empty) {
        setHasMorePosts(false);
        setLoadingMorePosts(false);
        return;
      }

      const newPosts = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((post) => post.createdAt);

      setFeedItems(prevItems => [...prevItems, ...newPosts]);
      setLastVisiblePost(snapshot.docs[snapshot.docs.length - 1]);
      setHasMorePosts(snapshot.docs.length === POSTS_PER_PAGE);

      const newCommentsMapUpdates = {};
      for (const post of newPosts) {
        newCommentsMapUpdates[post.id] = await fetchRecentComments(post.id);
      }
      setCommentsMap(prevMap => ({ ...prevMap, ...newCommentsMapUpdates }));
    } catch (error) {
      console.error("Error fetching more posts:", error);
      // Optionally show an error notification
    } finally {
      setLoadingMorePosts(false);
    }
  };
  
  // Optimized to fetch only 3 most recent comments for the feed display
  const fetchRecentComments = async (postId) => {
    const q = query(
      collection(db, 'comments'),
      where('postId', '==', postId),
      orderBy('createdAt', 'desc'),
      limit(3) // Fetch only 3 most recent comments
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  };

  const handleReaction = async (postId, emoji, currentEmojis) => {
    const userId = auth.currentUser.uid;
    const postRef = doc(db, 'posts', postId);
    const updated = {};

    Object.keys(currentEmojis || {}).forEach((key) => {
      updated[key] = (currentEmojis[key] || []).filter((id) => id !== userId);
    });

    updated[emoji] = [...(updated[emoji] || []), userId];

    Object.keys(updated).forEach((key) => {
      if (updated[key].length === 0) delete updated[key];
    });

    await updateDoc(postRef, { emojis: updated });
    setActivePicker(null);
  };

  const handleCommentReaction = async (commentId, emoji, currentEmojis, postId) => {
    const userId = auth.currentUser.uid;
    const commentRef = doc(db, 'comments', commentId);
    const updated = {};

    Object.keys(currentEmojis || {}).forEach((key) => {
      updated[key] = (currentEmojis[key] || []).filter((id) => id !== userId);
    });

    updated[emoji] = [...(updated[emoji] || []), userId];

    Object.keys(updated).forEach((key) => {
      if (updated[key].length === 0) delete updated[key];
    });

    await updateDoc(commentRef, { emojis: updated });
    const updatedComments = await fetchRecentComments(postId);
    setCommentsMap((prev) => ({ ...prev, [postId]: updatedComments }));
    setActiveCommentPicker(null);
  };

  const getUserReaction = (emojis) => {
    const userId = auth.currentUser.uid;
    for (const key in emojis) {
      if (emojis[key].includes(userId)) return key;
    }
    return null;
  };

  const handleCommentSubmit = async (postId) => {
    const content = commentInputs[postId]?.trim();
    if (!content) return;

    setIsPostingComment(prev => ({ ...prev, [postId]: true })); // Start loading for this post
    try {
      await addDoc(collection(db, 'comments'), {
        content,
        createdAt: Timestamp.now(),
        postId,
        userId: auth.currentUser.uid,
        parentId: '',
        emojis: {},
      });

      setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
      const updatedComments = await fetchRecentComments(postId);
      setCommentsMap((prev) => ({ ...prev, [postId]: updatedComments }));
    } catch (error) {
      console.error("Error posting comment:", error);
      // Optionally, show an error notification to the user
    } finally {
      setIsPostingComment(prev => ({ ...prev, [postId]: false })); // Stop loading for this post
    }
  };

  const handleDeleteComment = async (commentId, postId) => {
    await deleteDoc(doc(db, 'comments', commentId));
    const updatedComments = await fetchRecentComments(postId);
    setCommentsMap((prev) => ({ ...prev, [postId]: updatedComments }));
  };

  const openDeleteConfirmation = (postId) => {
    setConfirmModalProps({
      title: 'Delete Post',
      message: 'Are you sure you want to delete this post? This action cannot be undone.',
      onConfirm: () => executeDeletePost(postId),
      onCancel: () => setShowConfirmModal(false),
      confirmText: 'Delete',
    });
    setShowConfirmModal(true);
  };

  const executeDeletePost = async (postId) => {
    try {
      await deleteDoc(doc(db, 'posts', postId));
      // Optionally, show a success notification here
    } catch (error) {
      console.error("Error deleting post:", error);
      // Optionally, show an error notification here
    }
    setShowConfirmModal(false);
  };

  // handleDeleteComment would follow a similar pattern if it used window.confirm

  // Define reused class strings
  const tabClasses = "bg-coral text-white border-none py-3 px-5 rounded-[30px] text-base font-bold font-comfortaa cursor-pointer shadow-[0_3px_8px_rgba(0,0,0,0.2)] hover:bg-coral-dark transition-all";
  const itemClasses = "bg-white p-4 rounded-xl shadow-[0_2px_6px_rgba(0,0,0,0.15)]";
  const postContentClasses = "text-lg font-bold font-comfortaa text-charcoal";
  // Standard button style for primary actions like posting a comment or loading more
  const primaryButtonClasses = "bg-coral text-white py-3 px-6 rounded-full font-comfortaa font-bold text-base cursor-pointer transition-all duration-200 ease-in-out shadow-md hover:bg-coral-dark disabled:opacity-50";
  // Kept reactionButtonClasses for non-primary actions like opening emoji picker
  const reactionButtonClasses = "bg-white text-coral border border-coral rounded-full py-1.5 px-3 font-comfortaa cursor-pointer text-sm hover:bg-coral hover:text-white transition-colors";
  // Specific style for the comment post button, derived from primary but smaller
  const commentPostButtonClasses = "bg-coral text-white py-1.5 px-4 rounded-full font-comfortaa font-bold text-xs cursor-pointer transition-all duration-200 ease-in-out shadow-sm hover:bg-coral-dark disabled:opacity-70";


  return (
    <div className="relative min-h-screen font-comfortaa overflow-x-hidden z-0">
      <div className="fixed top-0 left-0 w-screen h-screen z-0 pointer-events-none">
        <FallingAEffect />
      </div>

      <div className="relative z-0"> {/* Ensure content is above FallingAEffect if it had a positive z-index, though it's 0 */}
        <header className="flex justify-center pt-4 mb-[-1rem]">
          <img
            src="/assets/amigoshangouts1.png"
            alt="Amigos Hangouts"
            className="h-[20em] w-auto animate-[pulse-a_1.75s_infinite] mb-[-5rem]"
          />
        </header>

        <nav className="flex justify-center mt-0 mb-6">
          <div className="bg-white py-3 px-4 rounded-[30px] shadow-[0_5px_15px_rgba(0,0,0,0.1)] flex gap-4">
            <button onClick={() => navigate('/')} className={tabClasses}>Home</button>
            <button onClick={() => navigate('/amigos')} className={tabClasses}>Amigos</button>
            <button onClick={() => navigate('/grupos')} className={tabClasses}>Grupos</button>
            <button onClick={() => navigate('/profile')} className={tabClasses}>Profile</button>
          </div>
        </nav>

        <div className="flex justify-center mb-8">
          <div className="bg-white p-8 rounded-[1.5rem] shadow-[0_5px_25px_rgba(0,0,0,0.2)] w-[90%] max-w-[800px] min-h-[60vh] text-center">
            <h2 className="text-3xl text-coral mb-4">Your Feed</h2> {/* text-3xl is approx 2rem */}
            {loadingMorePosts && feedItems.length === 0 ? ( // Initial loading state
              <div className="flex justify-center items-center h-64">
                <Spinner size="lg" color="coral" />
              </div>
            ) : feedItems.length > 0 ? (
              <ul className="flex flex-col gap-6 mt-4">
                {feedItems.map((item) => {
                  const userReact = getUserReaction(item.emojis || {});
                  const totalReacts = Object.values(item.emojis || {}).reduce((acc, arr) => acc + arr.length, 0);
                  const commentsForDisplay = commentsMap[item.id] || []; // Already limited to 3 by fetchRecentComments
                  const isOwner = auth.currentUser?.uid === item.userId;

                  return (
                    <li key={item.id} className={itemClasses}>
                      <p className={postContentClasses}>{item.content || 'Untitled Post'}</p> {/* Used postContentClasses */}
                      {item.imageUrl && <img src={item.imageUrl} alt="Post" className="max-w-full rounded-xl my-2" />}
                      {item.videoUrl && (
                        <video controls className="max-w-full rounded-xl my-2">
                          <source src={item.videoUrl} type="video/mp4" />
                        </video>
                      )}

                      <div className="flex items-center mt-2">
                        <input
                          type="text"
                          value={commentInputs[item.id] || ''}
                          onChange={(e) => setCommentInputs(prev => ({ ...prev, [item.id]: e.target.value }))}
                          placeholder="Write a comment..."
                          className="flex-1 p-1.5 rounded-xl border border-gray-300 text-sm font-comfortaa mr-2"
                          disabled={isPostingComment[item.id]} // Disable input while posting
                        />
                        <button
                          onClick={() => handleCommentSubmit(item.id)}
                          className={`${commentPostButtonClasses} ml-2 flex items-center justify-center w-[70px]`} // Applied new style, added flex and fixed width to prevent size change
                          disabled={isPostingComment[item.id]}
                        >
                          {isPostingComment[item.id] ? (
                            <Spinner size="sm" color="white" />
                          ) : (
                            'Post'
                          )}
                        </button>
                        <button
                          onClick={() => setActivePicker(activePicker === item.id ? null : item.id)}
                          className={`${reactionButtonClasses} ml-2 text-xs`} // Kept existing style for this one
                        >
                          {userReact || '😀'} {totalReacts > 0 && <span className="ml-1">{totalReacts}</span>} {/* Adjusted margin */}
                        </button>
                      </div>

                      {activePicker === item.id && (
                        <div className="mt-2 bg-white p-2 rounded-xl shadow-[0_2px_6px_rgba(0,0,0,0.15)] flex flex-wrap justify-center">
                          {emojiOptions.map((emoji) => (
                            <button key={emoji} onClick={() => handleReaction(item.id, emoji, item.emojis || {})} className="text-2xl m-1 bg-transparent border-none cursor-pointer hover:scale-125 transition-transform">{emoji}</button> // text-2xl for 1.4rem approx.
                          ))}
                        </div>
                      )}

                      <div className="mt-2 flex justify-between">
                        <button
                          onClick={() => setSelectedPost(item)}
                          className="text-xs text-coral bg-transparent border-none cursor-pointer hover:underline"
                        >
                          View All
                        </button>
                        {isOwner && (
                          <button
                            onClick={() => openDeleteConfirmation(item.id)} 
                            className="text-xs text-gray-500 bg-transparent border-none cursor-pointer hover:text-red-500 transition-colors" // Adjusted color and hover
                          >
                            🗑️ Delete
                          </button>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="font-comfortaa text-gray-600">No content to display yet. Follow amigos or join grupos to see activity.</p>
            )}
            {/* The paragraph for "Loading more posts..." will be removed as the button itself will show this state */}
            {hasMorePosts && feedItems.length > 0 && ( // Show button only if there are more posts and some items are already loaded
              <button
                onClick={fetchMorePosts}
                className={`${primaryButtonClasses} mt-6 text-sm flex items-center justify-center`}
                disabled={loadingMorePosts}
              >
                {loadingMorePosts ? (
                  <>
                    <Spinner size="sm" color="white" />
                    <span className="ml-2">Loading More...</span>
                  </>
                ) : (
                  'Load More Posts'
                )}
              </button>
            )}
            {!loadingMorePosts && !hasMorePosts && feedItems.length > 0 && ( // Keep this message for when there are no more posts
              <p className="font-comfortaa text-gray-500 mt-4">You've reached the end of the feed!</p>
            )}
          </div>
        </div>

        {selectedPost && (
          <PostDetailModal 
            post={selectedPost} 
            onClose={() => setSelectedPost(null)} 
            initialComments={commentsMap[selectedPost.id] || []} // Pass initially fetched comments
          />
        )}

        <ConfirmationModal
          isOpen={showConfirmModal}
          title={confirmModalProps.title}
          message={confirmModalProps.message}
          onConfirm={confirmModalProps.onConfirm}
          onCancel={confirmModalProps.onCancel}
          confirmText={confirmModalProps.confirmText}
        />
      </div>
    </div>
  );
};

// tabStyle, itemStyle, userName, reactionButtonStyle constants are no longer needed.

export default HomePage;
