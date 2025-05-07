// src/components/common/CommentSection.jsx
import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    if (!postId) return;

    const commentsRef = collection(db, "comments");
    const q = query(commentsRef, orderBy("createdAt", "asc"));

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

    try {
      await addDoc(collection(db, "comments"), {
        content: newComment,
        userId: auth.currentUser?.uid || "anon",
        postId,
        createdAt: serverTimestamp(),
      });
      setNewComment("");
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
    <div className="mt-4 text-sm">
      <form onSubmit={handleSubmit} className="flex gap-2 mb-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-grow px-3 py-1 rounded-full border border-[#FF6B6B] shadow-sm shadow-[#FF6B6B] focus:outline-none"
        />
        <button
          type="submit"
          className="bg-[#FF6B6B] text-white px-4 py-1 rounded-full shadow-sm shadow-[#FF6B6B] hover:bg-red-500 transition"
        >
          Post
        </button>
      </form>
      <ul className="space-y-1">
        {comments.map((comment) => (
          <li
            key={comment.id}
            className="bg-[#FFF0F0] border border-[#FF6B6B] shadow-md shadow-[#FF6B6B] p-2 rounded-lg flex justify-between items-center"
          >
            <p className="text-[#FF6B6B]">{comment.content}</p>
            {comment.userId === auth.currentUser?.uid && (
              <button
                onClick={() => handleDelete(comment.id)}
                className="text-[#FF6B6B] hover:text-red-600"
              >
                🗑️
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommentSection;
