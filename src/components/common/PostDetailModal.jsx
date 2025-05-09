// ✅ PostDetailModal now matches white-card style with zIndex 0
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
  deleteDoc,
} from "firebase/firestore";
import ReactionPicker from "./ReactionPicker";

const PostDetailModal = ({ post, onClose }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(null);
  const currentUser = auth.currentUser;

  useEffect(() => {
    const q = query(
      collection(db, "comments"),
      where("postId", "==", post.id),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setComments(commentList.filter((c) => !c.parentId));
    });
    return () => unsubscribe();
  }, [post.id]);

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;
    await addDoc(collection(db, "comments"), {
      content: newComment,
      createdAt: Timestamp.now(),
      postId: post.id,
      userId: currentUser?.uid || "anon",
      parentId: "",
      emojis: {},
    });
    setNewComment("");
  };

  const handleEmojiReact = async (commentId, emoji, currentMap = {}) => {
    const ref = doc(db, "comments", commentId);
    const userId = currentUser?.uid || "anon";
    const updated = {};
    Object.keys(currentMap).forEach((key) => {
      updated[key] = currentMap[key].filter((id) => id !== userId);
    });
    updated[emoji] = [...(updated[emoji] || []), userId];
    Object.keys(updated).forEach((key) => {
      if (updated[key].length === 0) delete updated[key];
    });
    await updateDoc(ref, { emojis: updated });
    setEmojiPickerVisible(null);
  };

  const handleEditStart = (comment) => {
    setEditingCommentId(comment.id);
    setEditedContent(comment.content);
  };

  const handleEditSave = async () => {
    if (!editedContent.trim()) return;
    await updateDoc(doc(db, "comments", editingCommentId), {
      content: editedContent,
    });
    setEditingCommentId(null);
    setEditedContent("");
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    try {
      await deleteDoc(doc(db, "comments", commentId));
    } catch {
      alert("Failed to delete comment");
    }
  };

  return ReactDOM.createPortal(
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0,0,0,0.6)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 0,
    }}>
      <div style={{
        backgroundColor: "#fff",
        padding: "2rem",
        borderRadius: "1rem",
        maxWidth: "700px",
        width: "90%",
        maxHeight: "90vh",
        overflowY: "auto",
        position: "relative",
        fontFamily: "Comfortaa, sans-serif",
        zIndex: 0
      }}>
        <button onClick={onClose} style={{ position: "absolute", top: "1rem", right: "1rem", border: "none", background: "none", fontSize: "1.5rem", cursor: "pointer", color: "#FF6B6B" }}>✖</button>

        <div style={{ backgroundColor: "#ffffff", padding: "1rem", borderRadius: "1rem", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", textAlign: "center", marginBottom: "2rem" }}>
          <h2 style={{ color: "#FF6B6B", marginBottom: "1rem" }}>Full Post</h2>
          <p style={{ fontWeight: "bold", fontSize: "1.1rem", color: "#FF6B6B" }}>{post.content || "Untitled Post"}</p>
          {post.imageUrl && <img src={post.imageUrl} alt="post" style={{ maxWidth: "100%", borderRadius: "1rem", marginTop: "1rem" }} />}
          {post.videoUrl && <video controls style={{ maxWidth: "100%", borderRadius: "1rem", marginTop: "1rem" }}><source src={post.videoUrl} type="video/mp4" /></video>}
        </div>

        <h3 style={{ color: "#FF6B6B", marginTop: "1rem" }}>Comments</h3>
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
          <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Write a comment..." style={{ flex: 1, padding: "0.5rem", borderRadius: "0.5rem", border: "1px solid #ccc", fontFamily: "Comfortaa, sans-serif" }} />
          <button onClick={handleCommentSubmit} style={{ backgroundColor: "#FFFFFF", color: "#FF6B6B", border: "1px solid #FF6B6B", padding: "0.5rem 1rem", borderRadius: "1rem", cursor: "pointer", fontWeight: "bold" }}>Post</button>
        </div>

        <div style={{ maxHeight: "300px", overflowY: "auto", marginTop: "1rem", paddingRight: "0.5rem" }}>
          {comments.map((comment) => {
            const canEdit = currentUser?.uid === comment.userId;
            const canDelete = currentUser?.uid === comment.userId || currentUser?.uid === post.userId;
            const reactions = comment.emojis || {};

            return (
              <div key={comment.id} style={{ backgroundColor: "#ffffff", color: "#FF6B6B", padding: "0.75rem 1rem", borderRadius: "1rem", marginBottom: "0.75rem", fontSize: "0.95rem", border: "1px solid #FF6B6B", position: "relative", fontFamily: "Comfortaa, sans-serif" }}>
                {editingCommentId === comment.id ? (
                  <>
                    <textarea value={editedContent} onChange={(e) => setEditedContent(e.target.value)} rows={2} style={{ width: "100%", fontFamily: "Comfortaa, sans-serif", padding: "0.5rem", border: "1px solid #ccc", borderRadius: "0.5rem", color: "#FF6B6B", backgroundColor: "#ffffff" }} />
                    <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem" }}>
                      <button onClick={handleEditSave} style={{ backgroundColor: "#FF6B6B", color: "#fff", border: "none", borderRadius: "1rem", padding: "0.3rem 1rem", cursor: "pointer", fontWeight: "bold" }}>Save</button>
                      <button onClick={() => setEditingCommentId(null)} style={{ backgroundColor: "#ccc", color: "#333", border: "none", borderRadius: "1rem", padding: "0.3rem 1rem", cursor: "pointer" }}>Cancel</button>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <p style={{ margin: 0 }}>💬 {comment.content}</p>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button onClick={() => setEmojiPickerVisible(emojiPickerVisible === comment.id ? null : comment.id)} style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "#FF6B6B" }}>😀</button>
                        {canEdit && <button onClick={() => handleEditStart(comment)} style={{ background: "none", border: "none", fontSize: "1.1rem", cursor: "pointer", color: "#FF6B6B" }}>✏️</button>}
                        {canDelete && <button onClick={() => handleDeleteComment(comment.id)} style={{ background: "none", border: "none", fontSize: "1.1rem", cursor: "pointer", color: "#888" }}>❌</button>}
                      </div>
                    </div>

                    {emojiPickerVisible === comment.id && (
                      <ReactionPicker onSelect={(emoji) => handleEmojiReact(comment.id, emoji, reactions)} />
                    )}

                    <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                      {Object.entries(reactions).map(([emoji, users]) => users.length > 0 ? (
                        <span key={emoji} style={{ fontSize: "1.1rem", color: "#FF6B6B", marginRight: "0.5rem" }}>{emoji} {users.length}</span>
                      ) : null)}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};

export default PostDetailModal;
