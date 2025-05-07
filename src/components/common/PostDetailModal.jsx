import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { db, auth } from "../../firebase";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  Timestamp,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";

const PostDetailModal = ({ post, onClose }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replies, setReplies] = useState({});
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(null);
  const emojiOptions = ["👍", "👎", "😂", "😢", "😮", "😍", "👏", "🔥", "💯"];

  useEffect(() => {
    const q = query(
      collection(db, "comments"),
      where("postId", "==", post.id),
      orderBy("createdAt", "desc")
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
    await addDoc(collection(db, "comments"), {
      content: newComment,
      createdAt: Timestamp.now(),
      postId: post.id,
      userId: auth.currentUser?.uid || "anon",
      parentId: "",
      emojis: {},
    });
    setNewComment("");
  };

  const handleEmojiReact = async (commentId, emoji, currentMap = {}) => {
    const ref = doc(db, "comments", commentId);
    const userId = auth.currentUser?.uid || "anon";
    const updated = {};

    Object.keys(currentMap).forEach((key) => {
      updated[key] = currentMap[key].filter((id) => id !== userId);
    });
    updated[emoji] = [...(updated[emoji] || []), userId];

    await updateDoc(ref, { emojis: updated });
    setEmojiPickerVisible(null);
  };

  return ReactDOM.createPortal(
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999999,
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "2rem",
          borderRadius: "1rem",
          maxWidth: "700px",
          width: "90%",
          maxHeight: "90vh",
          overflowY: "auto",
          position: "relative",
          fontFamily: "Comfortaa, sans-serif",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            border: "none",
            background: "none",
            fontSize: "1.5rem",
            cursor: "pointer",
            color: "#FF6B6B",
          }}
        >
          ✖
        </button>

        <div
          style={{
            backgroundColor: "#fff0f0",
            padding: "1rem",
            borderRadius: "1rem",
            boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
            textAlign: "center",
            marginBottom: "2rem",
          }}
        >
          <h2 style={{ color: "#FF6B6B", marginBottom: "1rem" }}>Full Post</h2>
          <p style={{ fontWeight: "bold", fontSize: "1.1rem", color: "#444" }}>
            {post.content}
          </p>
          {post.imageUrl && (
            <img
              src={post.imageUrl}
              alt="post"
              style={{ maxWidth: "100%", borderRadius: "1rem", marginTop: "1rem" }}
            />
          )}
          {post.videoUrl && (
            <video controls style={{ maxWidth: "100%", borderRadius: "1rem", marginTop: "1rem" }}>
              <source src={post.videoUrl} type="video/mp4" />
            </video>
          )}
        </div>

        <h3 style={{ color: "#FF6B6B", marginTop: "1rem" }}>Comments</h3>

        <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            style={{
              flex: 1,
              padding: "0.5rem",
              borderRadius: "0.5rem",
              border: "1px solid #ccc",
              fontFamily: "Comfortaa, sans-serif",
            }}
          />
          <button
            onClick={handleCommentSubmit}
            style={{
              backgroundColor: "#FF6B6B",
              color: "#fff",
              border: "none",
              padding: "0.5rem 1rem",
              borderRadius: "1rem",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Post
          </button>
        </div>

        <div style={{ maxHeight: "300px", overflowY: "auto", marginTop: "1rem", paddingRight: "0.5rem" }}>
          {comments.map((comment) => (
            <div
              key={comment.id}
              style={{
                padding: "0.75rem",
                borderBottom: "1px solid #eee",
                marginBottom: "0.75rem",
                color: "#444",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <p style={{ margin: 0 }}>🗨️ {comment.content}</p>
                <button
                  onClick={() =>
                    setEmojiPickerVisible(emojiPickerVisible === comment.id ? null : comment.id)
                  }
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "1.2rem",
                    cursor: "pointer",
                  }}
                >
                  😀
                </button>
              </div>

              {emojiPickerVisible === comment.id && (
                <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                  {emojiOptions.map((e) => (
                    <button
                      key={e}
                      onClick={() => handleEmojiReact(comment.id, e, comment.emojis || {})}
                      style={{
                        fontSize: "1.2rem",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              )}

              {replies[comment.id]?.slice(0, 3).map((reply) => (
                <div key={reply.id} style={{ marginLeft: "1.5rem", fontSize: "0.9rem", color: "#666" }}>
                  ↳ {reply.content}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};

export default PostDetailModal;
