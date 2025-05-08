// src/components/common/PostModal.jsx
import React from "react";
import PostForm from "./PostForm";

const PostModal = ({ onClose, isEdit = false, post = null }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        zIndex: 999999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        fontFamily: "Comfortaa, sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "1.5rem",
          padding: "2rem",
          width: "100%",
          maxWidth: "600px",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
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
          {isEdit ? "edit post" : "create post"}
        </h2>

        <PostForm onClose={onClose} post={post} />
      </div>
    </div>
  );
};

export default PostModal;
