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
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        zIndex: 1000001,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        transition: "opacity 0.3s ease-in-out",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "1.5rem",
          padding: "2rem",
          width: "100%",
          maxWidth: "640px",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
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
