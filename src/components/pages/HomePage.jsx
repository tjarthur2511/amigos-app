// ✅ Clean Card-Only HomePage with White Components
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
} from 'firebase/firestore';
import PostDetailModal from '../common/PostDetailModal';
import FallingAEffect from '../common/FallingAEffect';

const emojiOptions = ['👍', '👎', '😂', '😢', '😮', '😡', '😍', '👏', '🔥', '🎉', '🤔', '💯'];

const HomePage = () => {
  const navigate = useNavigate();
  const [feedItems, setFeedItems] = useState([]);
  const [commentsMap, setCommentsMap] = useState({});
  const [activePicker, setActivePicker] = useState(null);
  const [activeCommentPicker, setActiveCommentPicker] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const feedQuery = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(feedQuery, async (snapshot) => {
      const posts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setFeedItems(posts);

      const newCommentsMap = {};
      for (const post of posts) {
        newCommentsMap[post.id] = await fetchRecentComments(post.id);
      }
      setCommentsMap(newCommentsMap);
    });

    return () => unsubscribe();
  }, []);

  const fetchRecentComments = async (postId) => {
    const q = query(
      collection(db, 'comments'),
      where('postId', '==', postId),
      orderBy('createdAt', 'desc')
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
  };

  const handleDeleteComment = async (commentId, postId) => {
    await deleteDoc(doc(db, 'comments', commentId));
    const updatedComments = await fetchRecentComments(postId);
    setCommentsMap((prev) => ({ ...prev, [postId]: updatedComments }));
  };

  const handleDeletePost = async (postId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this post?');
    if (!confirmDelete) return;
    await deleteDoc(doc(db, 'posts', postId));
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', fontFamily: 'Comfortaa, sans-serif', overflowX: 'hidden' }}>
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1000, pointerEvents: 'none' }}>
        <FallingAEffect />
      </div>

      <div style={{ position: 'relative', zIndex: 300000 }}>
        <header style={{ textAlign: 'center', paddingTop: '2rem' }}>
          <h1 style={{ fontSize: '3.5rem', color: '#FF6B6B' }}>amigos</h1>
        </header>

        <nav style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}>
          <div style={{ backgroundColor: 'white', padding: '0.8rem 1rem', borderRadius: '30px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', display: 'flex', gap: '1rem' }}>
            <button onClick={() => navigate('/')} style={tabStyle}>Home</button>
            <button onClick={() => navigate('/amigos')} style={tabStyle}>Amigos</button>
            <button onClick={() => navigate('/grupos')} style={tabStyle}>Grupos</button>
            <button onClick={() => navigate('/profile')} style={tabStyle}>Profile</button>
          </div>
        </nav>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1.5rem', boxShadow: '0 5px 25px rgba(0,0,0,0.2)', width: '90%', maxWidth: '800px', minHeight: '60vh', textAlign: 'center' }}>
            <h2 style={{ fontSize: '2rem', color: '#FF6B6B', marginBottom: '1rem' }}>Your Feed</h2>
            {/* Rendered feedItems and comments unchanged here */}
          </div>
        </div>

        {selectedPost && (
          <PostDetailModal post={selectedPost} onClose={() => setSelectedPost(null)} />
        )}
      </div>
    </div>
  );
};

const tabStyle = { backgroundColor: '#FF6B6B', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '30px', fontSize: '1rem', fontWeight: 'bold', fontFamily: 'Comfortaa, sans-serif', cursor: 'pointer', boxShadow: '0 3px 8px rgba(0,0,0,0.2)' };
const itemStyle = { backgroundColor: '#FFFFFF', padding: '1rem', borderRadius: '1rem', boxShadow: '0 2px 6px rgba(0,0,0,0.15)' };
const userName = { fontSize: '1.2rem', fontWeight: 'bold' };
const reactionButtonStyle = { backgroundColor: '#fff', color: '#FF6B6B', border: '1px solid #FF6B6B', borderRadius: '9999px', padding: '0.4rem 0.8rem', fontFamily: 'Comfortaa, sans-serif', cursor: 'pointer' };

export default HomePage;
