import React, { useState, useRef, useEffect } from "react";
import { db, auth } from "../../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";

const PostForm = ({ onClose }) => {
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allAmigos, setAllAmigos] = useState([]);
  const [allGrupos, setAllGrupos] = useState([]);
  const [taggedAmigos, setTaggedAmigos] = useState([]);
  const [taggedGrupos, setTaggedGrupos] = useState([]);
  const fileInputRef = useRef(null);

  // Load all amigos and grupos
  useEffect(() => {
    const loadData = async () => {
      try {
        const amigosSnap = await getDocs(collection(db, "users"));
        const gruposSnap = await getDocs(collection(db, "grupos"));
        setAllAmigos(amigosSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setAllGrupos(gruposSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Error loading data: ", err);
        alert("Failed to load amigos and grupos.");
      }
    };
    loadData();
  }, []);

  // Extract hashtags from the content
  const extractHashtags = (text) => {
    return text.match(/#[a-zA-Z0-9_]+/g) || [];
  };

  // Handle post submission
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
    const mediaUrl = ""; // No upload storage yet (implement later)

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
        taggedAmigos,
        taggedGrupos,
        type: "amigo"
      });

      setContent("");
      setFile(null);
      setTaggedAmigos([]);
      setTaggedGrupos([]);
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

      {/* Tag amigos and grupos */}
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <select
          multiple
          value={taggedAmigos}
          onChange={(e) =>
            setTaggedAmigos(Array.from(e.target.selectedOptions, option => option.value))
          }
          style={{
            flex: 1,
            padding: "0.6rem",
            borderRadius: "1rem",
            fontFamily: "Comfortaa, sans-serif",
            fontSize: "0.95rem",
            border: "1px solid #ccc",
            backgroundColor: "#fff",
            color: "#444",
            minWidth: "48%"
          }}
        >
          <option disabled value="">Tag amigos</option>
          {allAmigos.map(a => (
            <option key={a.id} value={a.id}>{a.displayName || a.email}</option>
          ))}
        </select>

        <select
          multiple
          value={taggedGrupos}
          onChange={(e) =>
            setTaggedGrupos(Array.from(e.target.selectedOptions, option => option.value))
          }
          style={{
            flex: 1,
            padding: "0.6rem",
            borderRadius: "1rem",
            fontFamily: "Comfortaa, sans-serif",
            fontSize: "0.95rem",
            border: "1px solid #ccc",
            backgroundColor: "#fff",
            color: "#444",
            minWidth: "48%"
          }}
        >
          <option disabled value="">Tag grupos</option>
          {allGrupos.map(g => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>
      </div>

      {/* Media upload */}
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

      {/* Post button */}
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
          fontSize: "1rem",
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
