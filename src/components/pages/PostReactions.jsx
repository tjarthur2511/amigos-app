// src/components/common/PostReactions.jsx
import React, { useState } from "react";
import { updateDoc, doc } from "firebase/firestore";
import { db, auth } from "../../firebase";

const reactionOptions = ["👍", "👎", "😂", "😢", "🔥", "💯"];

const PostReactions = ({ post }) => {
  const [showPicker, setShowPicker] = useState(false);
  const userId = auth.currentUser?.uid;

  const currentReaction = post.reactions?.[userId] || null;
  const reactionCounts = Object.values(post.reactions || {}).reduce((acc, emoji) => {
    acc[emoji] = (acc[emoji] || 0) + 1;
    return acc;
  }, {});

  const handleReact = async (emoji) => {
    const newReactions = { ...post.reactions };
    if (currentReaction === emoji) {
      delete newReactions[userId];
    } else {
      newReactions[userId] = emoji;
    }
    await updateDoc(doc(db, "posts", post.id), { reactions: newReactions });
  };

  return (
    <div style={{ position: "relative", display: "inline-block", marginTop: "0.5rem" }}>
      <div
        onMouseEnter={() => setShowPicker(true)}
        onMouseLeave={() => setShowPicker(false)}
        style={{ cursor: "pointer" }}
      >
        <span style={{ fontSize: "1.2rem" }}>{currentReaction || "👍"}</span>
        <span style={{ marginLeft: "0.5rem", fontSize: "0.85rem", color: "#FF6B6B" }}>
          {Object.values(reactionCounts).reduce((a, b) => a + b, 0)}
        </span>
      </div>
      {showPicker && (
        <div
          style={{
            position: "absolute",
            top: "2rem",
            left: 0,
            background: "white",
            padding: "0.5rem",
            borderRadius: "1rem",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            zIndex: 9999,
            display: "flex",
            gap: "0.5rem"
          }}
        >
          {reactionOptions.map((emoji) => (
            <span
              key={emoji}
              onClick={() => handleReact(emoji)}
              style={{
                fontSize: "1.2rem",
                cursor: "pointer",
                padding: "0.3rem",
                borderRadius: "50%",
                backgroundColor: currentReaction === emoji ? "#FF6B6B22" : "transparent"
              }}
            >
              {emoji}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostReactions;
