// src/components/common/PostModal.jsx
import React from "react";
import PostForm from "./PostForm";

const PostModal = ({ onClose }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 10001,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "1.5rem",
          padding: "2rem",
          width: "100%",
          maxWidth: "640px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
          fontFamily: "Comfortaa, sans-serif",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            fontSize: "1.5rem",
            fontWeight: "bold",
            color: "#FF6B6B",
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
        >
          ✕
        </button>
        <h2
          style={{
            fontSize: "1.75rem",
            fontWeight: "bold",
            color: "#FF6B6B",
            marginBottom: "1.5rem",
            textAlign: "center",
            textTransform: "lowercase",
          }}
        >
          create post
        </h2>
        <PostForm onClose={onClose} />
      </div>
    </div>
  );
};

export default PostModal;
