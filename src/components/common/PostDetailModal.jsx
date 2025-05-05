import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { db, auth } from '../../firebase';
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  Timestamp,
  onSnapshot,
  doc,
  updateDoc
} from 'firebase/firestore';

const PostDetailModal = ({ post, onClose }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replies, setReplies] = useState({});
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(null);
  const emojiOptions = ['👍', '👎', '😂', '😢', '😮', '😡', '😍', '👏', '🔥', '🎉', '🤔', '💯'];

  useEffect(() => {
    const q = query(
      collection(db, 'comments'),
      where('postId', '==', post.id),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allComments = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const topLevel = allComments.filter((c) => !c.parentId);
      const replyMap = {};
      allComments.forEach((c) => {
        if (c.parentId) {
          if (!replyMap[c.parentId]) replyMap[c.parentId] = [];
          replyMap[c.parentId].push(c);
        }
      });
      setComments(topLevel);
      setReplies(replyMap);
    });

    return () => unsubscribe();
  }, [post.id]);

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;
    await addDoc(collection(db, 'comments'), {
      content: newComment,
      createdAt: Timestamp.now(),
      postId: post.id,
      userId: auth.currentUser.uid,
      parentId: '',
      emojis: {}
    });
    setNewComment('');
  };

  const handleEmojiReact = async (commentId, emoji, currentMap) => {
    const ref = doc(db, 'comments', commentId);
    const userId = auth.currentUser.uid;
    const updated = {};
    Object.keys(currentMap || {}).forEach((key) => {
      updated[key] = currentMap[key].filter((id) => id !== userId);
    });
    updated[emoji] = [...(updated[emoji] || []), userId];
    await updateDoc(ref, { emojis: updated });
    setEmojiPickerVisible(null);
  };

  return ReactDOM.createPortal(
    <div style={modalStyle}>
      <div style={contentStyle}>
        <button onClick={onClose} style={closeStyle}>✖</button>

        <div style={postCard}>
          <h2 style={{ color: '#FF6B6B', marginBottom: '1rem' }}>Full Post</h2>
          <p style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{post.content}</p>
          {post.imageUrl && <img src={post.imageUrl} alt="post" style={mediaStyle} />}
          {post.videoUrl && (
            <video controls style={mediaStyle}>
              <source src={post.videoUrl} type="video/mp4" />
            </video>
          )}
        </div>

        <h3 style={{ color: '#FF6B6B', marginTop: '1rem' }}>Comments</h3>

        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            style={inputStyle}
          />
          <button onClick={handleCommentSubmit} style={submitStyle}>Post</button>
        </div>

        <div style={scrollBox}>
          {comments.map((comment) => (
            <div key={comment.id} style={commentStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p style={{ margin: 0 }}>🗨️ {comment.content}</p>
                <button
                  onClick={() =>
                    setEmojiPickerVisible(emojiPickerVisible === comment.id ? null : comment.id)
                  }
                  style={emojiToggleStyle}
                >
                  😀
                </button>
              </div>

              {emojiPickerVisible === comment.id && (
                <div style={emojiPickerStyle}>
                  {emojiOptions.map((e) => (
                    <button
                      key={e}
                      onClick={() => handleEmojiReact(comment.id, e, comment.emojis || {})}
                      style={emojiStyle}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              )}

              {replies[comment.id]?.slice(0, 3).map((reply) => (
                <div key={reply.id} style={replyStyle}>
                  ↳ {reply.content}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.getElementById('modal-root')
  );
};

// Styles
const modalStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0,0,0,0.6)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 999999
};

const contentStyle = {
  backgroundColor: '#fff',
  padding: '2rem',
  borderRadius: '1rem',
  maxWidth: '700px',
  width: '90%',
  maxHeight: '90vh',
  overflowY: 'auto',
  position: 'relative',
  fontFamily: 'Comfortaa, sans-serif'
};

const closeStyle = {
  position: 'absolute',
  top: '1rem',
  right: '1rem',
  border: 'none',
  background: 'none',
  fontSize: '1.5rem',
  cursor: 'pointer'
};

const postCard = {
  backgroundColor: '#fff0f0',
  padding: '1rem',
  borderRadius: '1rem',
  boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
  textAlign: 'center',
  marginBottom: '2rem'
};

const mediaStyle = {
  maxWidth: '100%',
  borderRadius: '1rem',
  marginTop: '1rem'
};

const inputStyle = {
  flex: 1,
  padding: '0.5rem',
  borderRadius: '0.5rem',
  border: '1px solid #ccc',
  fontFamily: 'Comfortaa, sans-serif'
};

const submitStyle = {
  backgroundColor: '#FF6B6B',
  color: '#fff',
  border: 'none',
  padding: '0.5rem 1rem',
  borderRadius: '1rem',
  cursor: 'pointer',
  fontWeight: 'bold'
};

const scrollBox = {
  maxHeight: '300px',
  overflowY: 'auto',
  marginTop: '1rem',
  paddingRight: '0.5rem'
};

const commentStyle = {
  padding: '0.75rem',
  borderBottom: '1px solid #eee',
  marginBottom: '0.75rem'
};

const replyStyle = {
  marginLeft: '1.5rem',
  fontSize: '0.9rem',
  color: '#555',
  marginTop: '0.25rem'
};

const emojiToggleStyle = {
  background: 'none',
  border: 'none',
  fontSize: '1.2rem',
  cursor: 'pointer'
};

const emojiPickerStyle = {
  marginTop: '0.5rem',
  display: 'flex',
  gap: '0.4rem',
  flexWrap: 'wrap'
};

const emojiStyle = {
  fontSize: '1.2rem',
  background: 'none',
  border: 'none',
  cursor: 'pointer'
};

export default PostDetailModal;
