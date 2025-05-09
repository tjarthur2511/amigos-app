// ✅ Clean Card-Only PostCard Component
import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebase";
import { doc, getDoc, collection, query, where, getDocs, updateDoc } from "firebase/firestore";
import PostDetailModal from "./PostDetailModal";
import PostModal from "./PostModal";
import ReactionPicker from "./ReactionPicker";

const PostCard = ({ post }) => {
  const [author, setAuthor] = useState(null);
  const [comments, setComments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(null);

  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchData = async () => {
      const userSnap = await getDoc(doc(db, "users", post.userId));
      if (userSnap.exists()) setAuthor(userSnap.data());

      const commentsQuery = query(
        collection(db, "comments"),
        where("postId", "==", post.id)
      );
      const commentDocs = await getDocs(commentsQuery);
      const sortedComments = commentDocs.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds)
        .slice(0, 3);
      setComments(sortedComments);
    };

    fetchData();
  }, [post]);

  const handleEmojiReact = async (commentId, emoji, currentMap = {}) => {
    const ref = doc(db, "comments", commentId);
    const userId = currentUser?.uid || "anon";
    const updated = {};

    Object.keys(currentMap).forEach((key) => {
      updated[key] = currentMap[key].filter((id) => id !== userId);
    });

    const alreadyReacted = (currentMap[emoji] || []).includes(userId);
    if (!alreadyReacted) {
      updated[emoji] = [...(updated[emoji] || []), userId];
    }

    await updateDoc(ref, { emojis: updated });
    setEmojiPickerVisible(null);
  };

  return (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: "1.5rem",
        padding: "1.5rem",
        marginBottom: "2rem",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        fontFamily: "Comfortaa, sans-serif",
        position: "relative",
        zIndex: 0
      }}
    >
      {currentUser?.uid === post.userId && (
        <button
          onClick={() => setShowEditModal(true)}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: "transparent",
            border: "none",
            fontSize: "1.25rem",
            cursor: "pointer",
            color: "#FF6B6B"
          }}
        >
          ✏️
        </button>
      )}

      <div style={{ marginBottom: "0.5rem", fontWeight: "bold", color: "#FF6B6B" }}>
        @{author?.displayName || "anon"}
      </div>

      {post.content && (
        <p style={{
          fontSize: "1rem",
          color: "#FF6B6B",
          marginBottom: "1rem",
          wordWrap: "break-word",
          whiteSpace: "pre-line"
        }}>
          {post.content}
        </p>
      )}

      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt="post media"
          style={{
            width: "100%",
            borderRadius: "1rem",
            marginBottom: "1rem",
            objectFit: "cover"
          }}
        />
      )}

      {post.videoUrl && (
        <video
          src={post.videoUrl}
          controls
          style={{
            width: "100%",
            borderRadius: "1rem",
            marginBottom: "1rem"
          }}
        />
      )}

      <div style={{ fontSize: "0.9rem", color: "#FF6B6B", marginBottom: "0.5rem" }}>
        {post.hashtags?.map((tag) => (
          <span key={tag} style={{ marginRight: "0.5rem" }}>{tag}</span>
        ))}
      </div>

      <div style={{ fontSize: "0.9rem", color: "#999", marginBottom: "1rem" }}>
        Tagged:
        {(post.taggedAmigos || []).map(uid => (
          <span key={uid} style={{ marginLeft: "0.3rem" }}>👤</span>
        ))}
        {(post.taggedGrupos || []).map(gid => (
          <span key={gid} style={{ marginLeft: "0.3rem" }}>👥</span>
        ))}
      </div>

      <div style={{ marginTop: "1rem" }}>
        {comments.map((comment) => {
          const reactions = comment.emojis || {};
          return (
            <div
              key={comment.id}
              style={{
                backgroundColor: "#ffffff",
                padding: "0.5rem 1rem",
                borderRadius: "0.75rem",
                marginBottom: "0.5rem",
                fontSize: "0.95rem",
                color: "#FF6B6B",
                fontWeight: "500",
                position: "relative",
                border: "1px solid #FF6B6B"
              }}
            >
              <strong style={{ marginRight: "0.3rem" }}>💬</strong>
              {comment.content}
              <div style={{ marginTop: "0.4rem", display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                {Object.entries(reactions).map(([emoji, users]) => (
                  <span
                    key={emoji}
                    style={{ fontSize: "1.1rem", color: "#FF6B6B", marginRight: "0.5rem" }}
                  >
                    {emoji} {users.length}
                  </span>
                ))}
                <button
                  onClick={() =>
                    setEmojiPickerVisible(emojiPickerVisible === comment.id ? null : comment.id)
                  }
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "1.1rem",
                    cursor: "pointer",
                    color: "#FF6B6B"
                  }}
                >
                  😀
                </button>
              </div>
              {emojiPickerVisible === comment.id && (
                <ReactionPicker onSelect={(emoji) => handleEmojiReact(comment.id, emoji, reactions)} />
              )}
            </div>
          );
        })}
      </div>

      <div style={{ textAlign: "right" }}>
        <button
          onClick={() => setShowModal(true)}
          style={{
            backgroundColor: "#FFFFFF",
            color: "#FF6B6B",
            border: "1px solid #FF6B6B",
            padding: "0.6rem 1.2rem",
            borderRadius: "1rem",
            fontWeight: "bold",
            fontSize: "0.9rem",
            marginTop: "1rem",
            cursor: "pointer"
          }}
        >
          View All Comments
        </button>
      </div>

      {showModal && <PostDetailModal post={post} onClose={() => setShowModal(false)} />}
      {showEditModal && (
        <PostModal post={post} isEdit={true} onClose={() => setShowEditModal(false)} />
      )}
    </div>
  );
};

export default PostCard;