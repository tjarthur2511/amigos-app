// src/components/common/CommentSection.jsx
import React, { useEffect, useState, useRef } from "react";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db, auth } from "../../firebase";

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (!postId) return;

    const q = query(collection(db, "comments"), orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postComments = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((c) => c.postId === postId);
      setComments(postComments);
    });

    return () => unsubscribe();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    if (!auth.currentUser) {
      alert("Please log in to post a comment.");
      return;
    }

    try {
      await addDoc(collection(db, "comments"), {
        content: newComment,
        userId: auth.currentUser.uid, // auth.currentUser is now guaranteed to exist
        postId,
        createdAt: serverTimestamp(),
      });
      setNewComment("");
      inputRef.current?.focus();
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await deleteDoc(doc(db, "comments", commentId));
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  return (
    <div className="mt-4 text-sm font-comfortaa">
      <form onSubmit={handleSubmit} className="flex items-center gap-2 mb-3">
        <input
          ref={inputRef}
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-grow px-4 py-2 rounded-full border border-[#FF6B6B] text-[#FF6B6B] placeholder-[#FF6B6B] bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
        />
        <button
          type="submit"
          className="bg-[#FF6B6B] text-white px-4 py-2 rounded-full hover:bg-[#e65050] transition font-bold shadow"
        >
          Post
        </button>
      </form>

      {comments.length > 0 ? (
        <ul className="space-y-3">
          {comments.map((comment) => (
            <li key={comment.id}>
              <div
                style={{
                  backgroundColor: "#ffffff",
                  color: "#FF6B6B",
                  zIndex: 9999,
                  position: "relative",
                  padding: "0.75rem 1rem",
                  borderRadius: "1rem",
                  border: "1px solid #FF6B6B",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                }}
              >
                <span
                  style={{
                    flex: 1,
                    wordBreak: "break-word",
                    fontSize: "0.95rem",
                    fontWeight: "500",
                  }}
                >
                  {comment.content}
                </span>
                {comment.userId === auth.currentUser?.uid && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    style={{
                      color: "#FF6B6B",
                      fontSize: "1.2rem",
                      marginLeft: "1rem",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                    title="Delete comment"
                  >
                    🗑️
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-[#FF6B6B] opacity-75 mt-2">No comments yet.</p>
      )}
    </div>
  );
};

export default CommentSection;
