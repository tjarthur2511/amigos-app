// src/components/common/PostReactions.jsx
import React, { useState, useEffect } from "react";
import { db, auth } from "../../firebase";
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";

const emojiOptions = ["😀", "😂", "😢", "😮", "😡", "😍", "👍", "👎", "🔥", "🎉"];

const PostReactions = ({ post }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [likes, setLikes] = useState(post.likes || []);
  const [dislikes, setDislikes] = useState(post.dislikes || []);
  const [emojis, setEmojis] = useState(post.emojis || {});

  const userId = auth.currentUser?.uid;

  useEffect(() => {
    setLikes(post.likes || []);
    setDislikes(post.dislikes || []);
    setEmojis(post.emojis || {});
  }, [post]);

  const updateReactions = async (updates) => {
    const postRef = doc(db, "posts", post.id);
    await updateDoc(postRef, updates);
  };

  const toggleLike = async () => {
    const postRef = doc(db, "posts", post.id);
    if (likes.includes(userId)) {
      await updateDoc(postRef, {
        likes: arrayRemove(userId)
      });
    } else {
      await updateDoc(postRef, {
        likes: arrayUnion(userId),
        dislikes: arrayRemove(userId)
      });
    }
  };

  const toggleDislike = async () => {
    const postRef = doc(db, "posts", post.id);
    if (dislikes.includes(userId)) {
      await updateDoc(postRef, {
        dislikes: arrayRemove(userId)
      });
    } else {
      await updateDoc(postRef, {
        dislikes: arrayUnion(userId),
        likes: arrayRemove(userId)
      });
    }
  };

  const addEmoji = async (emoji) => {
    const postRef = doc(db, "posts", post.id);
    const current = emojis[emoji] || [];
    if (!current.includes(userId)) {
      const newEmojis = { ...emojis, [emoji]: [...current, userId] };
      await updateDoc(postRef, { emojis: newEmojis });
    }
    setShowPicker(false);
  };

  const emojiCount = (emoji) => (emojis[emoji]?.length || 0);

  return (
    <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ display: "flex", gap: "1rem" }}>
        <button onClick={toggleLike} style={reactionBtn}>
          👍 {likes.length}
        </button>
        <button onClick={toggleDislike} style={reactionBtn}>
          👎 {dislikes.length}
        </button>
        <button onClick={() => setShowPicker(!showPicker)} style={reactionBtn}>
          😊 Emoji
        </button>
      </div>

      {showPicker && (
        <div style={pickerStyle}>
          {emojiOptions.map((emoji) => (
            <button
              key={emoji}
              onClick={() => addEmoji(emoji)}
              style={{ fontSize: "1.5rem", padding: "0.5rem", cursor: "pointer" }}
            >
              {emoji} {emojiCount(emoji) > 0 ? emojiCount(emoji) : ""}
            </button>
          ))}
        </div>
      )}

      <div style={{ marginTop: "0.5rem", display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
        {Object.entries(emojis).map(([emoji, users]) => (
          <span key={emoji} style={{ margin: "0 0.5rem", fontSize: "1.2rem" }}>
            {emoji} {users.length}
          </span>
        ))}
      </div>
    </div>
  );
};

const reactionBtn = {
  backgroundColor: "#FFFFFF",
  color: "#FF6B6B",
  border: "none",
  padding: "0.4rem 1rem",
  borderRadius: "9999px",
  fontSize: "0.9rem",
  fontWeight: "bold",
  fontFamily: "Comfortaa, sans-serif",
  cursor: "pointer",
  boxShadow: "0 3px 6px rgba(0,0,0,0.15)"
};

const pickerStyle = {
  backgroundColor: "#fff",
  borderRadius: "1rem",
  padding: "1rem",
  boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
  maxHeight: "150px",
  overflowY: "auto",
  marginTop: "0.5rem"
};

export default PostReactions;
