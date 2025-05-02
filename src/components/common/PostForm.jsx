// src/components/common/PostForm.jsx
import React, { useState, useRef } from "react";
import { db, auth, storage } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

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
    if (!content.trim() && !file) {
      alert("Write something or upload a file!");
      return;
    }

    setLoading(true);
    let mediaUrl = "";
    let mediaType = "";

    try {
      if (file) {
        const storageRef = ref(storage, `posts/${uuidv4()}_${file.name}`);
        await uploadBytes(storageRef, file);
        mediaUrl = await getDownloadURL(storageRef);
        mediaType = file.type.startsWith("video") ? "video" : "image";
      }

      await addDoc(collection(db, "posts"), {
        content,
        userId: auth.currentUser?.uid || "anon",
        createdAt: serverTimestamp(),
        likes: [],
        dislikes: [],
        emojis: {},
        hashtags: extractHashtags(content),
        imageUrl: mediaType === "image" ? mediaUrl : "",
        videoUrl: mediaType === "video" ? mediaUrl : "",
        type: "amigo",
      });

      setContent("");
      setFile(null);
      if (typeof onClose === "function") onClose();
    } catch (error) {
      console.error("Post failed:", error);
    }
    setLoading(false);
  };

  const handleFileSelect = (type) => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = type === "video" ? "video/*" : "image/*";
      fileInputRef.current.click();
    }
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
          onClick={() => handleFileSelect("image")}
          style={{
            fontSize: "1.5rem",
            backgroundColor: "transparent",
            border: "none",
            cursor: "pointer",
            animation: "pulse 2s infinite",
          }}
        >
          📸
        </button>
        <button
          type="button"
          onClick={() => handleFileSelect("video")}
          style={{
            fontSize: "1.5rem",
            backgroundColor: "transparent",
            border: "none",
            cursor: "pointer",
            animation: "pulse 2s infinite",
          }}
        >
          🎥
        </button>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => setFile(e.target.files[0])}
        style={{ display: "none" }}
      />

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
