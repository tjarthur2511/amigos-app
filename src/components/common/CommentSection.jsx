import React, { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
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

  return (
    <div className="mt-4 text-sm">
      <form onSubmit={handleSubmit} className="flex gap-2 mb-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-grow px-3 py-1 rounded-full border border-gray-300 focus:outline-none"
        />
        <button
          type="submit"
          className="bg-[#FF6B6B] text-white px-4 py-1 rounded-full hover:bg-red-500"
        >
          Post
        </button>
      </form>
      <ul className="space-y-1">
        {comments.map((comment) => (
          <li key={comment.id} className="bg-gray-100 p-2 rounded-lg">
            <p className="text-gray-700">{comment.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommentSection;
