import React, { useState, useRef } from "react";
import { db, auth } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const PostForm = ({ onClose }) => {
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const extractHashtags = (text) => {
    return text.match(/#[a-zA-Z0-9_]+/g) || [];
  };

  const handlePost = async (e) => {
    e.preventDefault();
    const trimmedContent = content.trim();
    const hasText = trimmedContent.length > 0;
    const hasMedia = file !== null;

    if (!hasText && !hasMedia) {
      alert("You must write something or select a file.");
      return;
    }

    setLoading(true);

    const mediaType = file ? (file.type.startsWith("video") ? "video" : "image") : "";
    const mediaUrl = ""; // No upload yet, keep blank

    try {
      await addDoc(collection(db, "posts"), {
        content: trimmedContent,
        userId: auth.currentUser?.uid || "anon",
        createdAt: serverTimestamp(),
        emojis: {},
        likes: [],
        dislikes: [],
        hashtags: extractHashtags(trimmedContent),
        imageUrl: mediaType === "image" ? mediaUrl : "",
        videoUrl: mediaType === "video" ? mediaUrl : "",
        type: "amigo",
      });

      setContent("");
      setFile(null);
      if (typeof onClose === "function") onClose();
    } catch (err) {
      console.error("Firestore error:", err);
      alert("Post failed to save.");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handlePost} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <textarea
        placeholder="what's on your mind amigo?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
        style={{
          width: "100%",
          padding: "1rem",
          borderRadius: "1rem",
          border: "1px solid #ccc",
          backgroundColor: "#fef2f2",
          color: "#FF6B6B",
          fontFamily: "Comfortaa, sans-serif",
          fontSize: "1rem",
          resize: "none",
        }}
      />

      <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          style={{
            fontSize: "1.5rem",
            backgroundColor: "transparent",
            border: "none",
            cursor: "pointer",
            animation: "pulse 2s infinite",
          }}
        >
          📸/🎥
        </button>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        accept="image/*,video/*"
        onChange={(e) => setFile(e.target.files[0])}
        style={{ display: "none" }}
      />

      {file && (
        <div style={{ textAlign: "center" }}>
          {file.type.startsWith("image") ? (
            <img
              src={URL.createObjectURL(file)}
              alt="Preview"
              style={{
                maxWidth: "100%",
                maxHeight: "200px",
                objectFit: "cover",
                borderRadius: "1rem",
                marginBottom: "1rem",
              }}
            />
          ) : (
            <video
              src={URL.createObjectURL(file)}
              controls
              style={{
                maxWidth: "100%",
                maxHeight: "240px",
                borderRadius: "1rem",
                marginBottom: "1rem",
              }}
            />
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        style={{
          width: "100%",
          backgroundColor: "#FF6B6B",
          color: "#fff",
          padding: "0.9rem",
          border: "none",
          borderRadius: "9999px",
          fontWeight: "bold",
          fontFamily: "Comfortaa, sans-serif",
          cursor: "pointer",
          transition: "0.2s ease-in-out",
        }}
      >
        {loading ? "Posting..." : "Post"}
      </button>
    </form>
  );
};

export default PostForm;
