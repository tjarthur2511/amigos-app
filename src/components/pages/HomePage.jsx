// src/components/pages/HomePage.jsx
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
  deleteDoc
} from 'firebase/firestore';
import FallingAEffect from './FallingAEffect';
import PostDetailModal from '../common/PostDetailModal';

const emojiOptions = ['👍', '👎', '😂', '😢', '😮', '😡', '😍', '👏', '🔥', '🎉', '🤔', '💯'];

const HomePage = () => {
  const navigate = useNavigate();
  const [feedItems, setFeedItems] = useState([]);
  const [commentsMap, setCommentsMap] = useState({});
  const [activePicker, setActivePicker] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const feedQuery = query(collection(db, 'posts'));
    const unsubscribe = onSnapshot(feedQuery, async (snapshot) => {
      const posts = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));

      setFeedItems(posts);

      const newCommentsMap = {};
      for (const post of posts) {
        newCommentsMap[post.id] = await fetchComments(post.id);
      }
      setCommentsMap(newCommentsMap);
    });

    return () => unsubscribe();
  }, []);

  const fetchComments = async (postId) => {
    const q = query(
      collection(db, 'comments'),
      where('postId', '==', postId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  };

  const handleReaction = async (postId, emoji, currentEmojis) => {
    const userId = auth.currentUser.uid;
    const postRef = doc(db, 'posts', postId);
    const updated = {};

    Object.keys(currentEmojis || {}).forEach((key) => {
      updated[key] = (currentEmojis[key] || []).filter((id) => id !== userId);
    });

    updated[emoji] = [...(updated[emoji] || []), userId];

    await updateDoc(postRef, { emojis: updated });
    setActivePicker(null);
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
      emojis: {}
    });

    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
  };

  const handleDeletePost = async (postId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this post?');
    if (!confirmDelete) return;
    await deleteDoc(doc(db, 'posts', postId));
  };

  return (
    <div style={{ fontFamily: 'Comfortaa, sans-serif', backgroundColor: '#FF6B6B', minHeight: '100vh', overflow: 'hidden', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}>
        <FallingAEffect />
      </div>

      <header style={{ textAlign: 'center', paddingTop: '2rem' }}>
        <h1 style={{ fontSize: '3.5rem', color: 'white' }}>amigos</h1>
      </header>

      <nav style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem', marginBottom: '2rem' }}>
        <div style={{ backgroundColor: 'white', padding: '0.8rem 1rem', borderRadius: '30px', boxShadow: '0 5px 15px rgba(0,0,0,0.3)', display: 'flex', gap: '1rem' }}>
          <button onClick={() => navigate('/')} style={tabStyle}>Home</button>
          <button onClick={() => navigate('/amigos')} style={tabStyle}>Amigos</button>
          <button onClick={() => navigate('/grupos')} style={tabStyle}>Grupos</button>
          <button onClick={() => navigate('/profile')} style={tabStyle}>Profile</button>
        </div>
      </nav>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1.5rem', boxShadow: '0 5px 25px rgba(0,0,0,0.2)', width: '90%', maxWidth: '800px', minHeight: '60vh', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', color: '#FF6B6B', marginBottom: '1rem' }}>Your Feed</h2>
          {feedItems.length > 0 ? (
            <ul style={listStyle}>
              {feedItems.map((item) => {
                const userReact = getUserReaction(item.emojis || {});
                const totalReacts = Object.values(item.emojis || {}).reduce((acc, arr) => acc + arr.length, 0);
                const comments = commentsMap[item.id] || [];
                const isOwner = auth.currentUser?.uid === item.userId;

                return (
                  <li key={item.id} style={itemStyle}>
                    <p style={userName}>{item.content || 'Untitled Post'}</p>
                    {item.imageUrl && <img src={item.imageUrl} alt="Post" style={{ maxWidth: '100%', borderRadius: '1rem' }} />}
                    {item.videoUrl && (
                      <video controls style={{ maxWidth: '100%', borderRadius: '1rem' }}>
                        <source src={item.videoUrl} type="video/mp4" />
                      </video>
                    )}

                    {comments.slice(0, 3).map((comment) => (
                      <div key={comment.id} style={{ backgroundColor: '#fff7f7', padding: '0.5rem 1rem', borderRadius: '0.5rem', margin: '0.25rem 0', textAlign: 'left', fontSize: '0.95rem' }}>
                        <strong style={{ marginRight: '0.5rem' }}>🗨️</strong>{comment.content}
                      </div>
                    ))}

                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
                      <input
                        type="text"
                        value={commentInputs[item.id] || ''}
                        onChange={(e) => setCommentInputs(prev => ({ ...prev, [item.id]: e.target.value }))}
                        placeholder="Write a comment..."
                        style={{ flex: 1, padding: '0.4rem', borderRadius: '1rem', border: '1px solid #ccc', fontSize: '0.9rem', fontFamily: 'Comfortaa, sans-serif' }}
                      />
                      <button onClick={() => handleCommentSubmit(item.id)} style={{ ...reactionButtonStyle, marginLeft: '0.5rem', fontSize: '0.8rem' }}>Post</button>
                      <button
                        onClick={() => setActivePicker(activePicker === item.id ? null : item.id)}
                        style={{ ...reactionButtonStyle, marginLeft: '0.5rem', fontSize: '0.8rem' }}
                      >
                        {userReact || '😀'} {totalReacts > 0 && <span style={{ marginLeft: '0.3rem' }}>{totalReacts}</span>}
                      </button>
                    </div>

                    {activePicker === item.id && (
                      <div style={{ marginTop: '0.5rem', backgroundColor: '#fff', padding: '0.5rem', borderRadius: '1rem', boxShadow: '0 2px 6px rgba(0,0,0,0.15)', display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {emojiOptions.map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => handleReaction(item.id, emoji, item.emojis || {})}
                            style={{ fontSize: '1.4rem', margin: '0.25rem', background: 'none', border: 'none', cursor: 'pointer' }}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    )}

                    <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                      <button
                        onClick={() => setSelectedPost(item)}
                        style={{ fontSize: '0.8rem', color: '#FF6B6B', background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        View All
                      </button>
                      {isOwner && (
                        <button
                          onClick={() => handleDeletePost(item.id)}
                          style={{ fontSize: '0.8rem', color: '#888', background: 'none', border: 'none', cursor: 'pointer' }}
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
            <p>No content to display yet. Follow amigos or join grupos to see activity.</p>
          )}
        </div>
      </div>

      {selectedPost && (
        <PostDetailModal post={selectedPost} onClose={() => setSelectedPost(null)} />
      )}
    </div>
  );
};

const tabStyle = {
  backgroundColor: '#FF6B6B',
  color: 'white',
  border: 'none',
  padding: '12px 20px',
  borderRadius: '30px',
  fontSize: '1rem',
  fontWeight: 'bold',
  fontFamily: 'Comfortaa, sans-serif',
  cursor: 'pointer',
  boxShadow: '0 3px 8px rgba(0,0,0,0.2)'
};

const listStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
  marginTop: '1rem'
};

const itemStyle = {
  backgroundColor: '#ffecec',
  padding: '1rem',
  borderRadius: '1rem',
  boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
};

const userName = {
  fontSize: '1.2rem',
  fontWeight: 'bold'
};

const reactionButtonStyle = {
  backgroundColor: '#fff',
  color: '#FF6B6B',
  border: '1px solid #FF6B6B',
  borderRadius: '9999px',
  padding: '0.4rem 0.8rem',
  fontFamily: 'Comfortaa, sans-serif',
  cursor: 'pointer'
};

export default HomePage;
