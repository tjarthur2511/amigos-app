// ✅ Clean + Auth-Checked PostForm Component
import React, { useState, useRef, useEffect } from "react";
import { db, auth } from "../../firebase";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const PostForm = ({ onClose, post = null }) => {
  const isEdit = !!post;
  const [content, setContent] = useState(post?.content || "");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allAmigos, setAllAmigos] = useState([]);
  const [allGrupos, setAllGrupos] = useState([]);
  const [taggedAmigos, setTaggedAmigos] = useState(post?.taggedAmigos || []);
  const [taggedGrupos, setTaggedGrupos] = useState(post?.taggedGrupos || []);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      const amigosSnap = await getDocs(collection(db, "users"));
      const gruposSnap = await getDocs(collection(db, "grupos"));
      setAllAmigos(amigosSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setAllGrupos(gruposSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    loadData();
  }, []);

  const extractHashtags = (text) => text.match(/#[a-zA-Z0-9_]+/g) || [];

  const handlePost = async (e) => {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed && !file) return alert("Add text or media.");

    const currentUser = auth.currentUser;

    if (!currentUser) {
      return onAuthStateChanged(auth, async (user) => {
        if (!user) return alert("You must be logged in to post.");
        await submitPost(user.uid);
      });
    }

    await submitPost(currentUser.uid);
  };

  const submitPost = async (uid) => {
    setLoading(true);
    const mediaType = file ? (file.type.startsWith("video") ? "video" : "image") : "";
    const mediaUrl = "";

    try {
      if (isEdit) {
        const postRef = doc(db, "posts", post.id);
        await updateDoc(postRef, {
          content: content.trim(),
          hashtags: extractHashtags(content),
          taggedAmigos,
          taggedGrupos,
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, "posts"), {
          content: content.trim(),
          userId: uid,
          createdAt: serverTimestamp(),
          emojis: {},
          likes: [],
          dislikes: [],
          hashtags: extractHashtags(content),
          imageUrl: mediaType === "image" ? mediaUrl : "",
          videoUrl: mediaType === "video" ? mediaUrl : "",
          taggedAmigos,
          taggedGrupos,
          type: "amigo",
        });
      }
      if (typeof onClose === "function") onClose();
    } catch (err) {
      console.error("Post failed:", err);
      alert("Post failed.");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handlePost} style={{ display: "flex", flexDirection: "column", gap: "1rem", backgroundColor: "white", padding: "1.5rem", borderRadius: "1.5rem", boxShadow: "0 5px 25px rgba(0,0,0,0.1)", zIndex: 0 }}>
      <textarea
        placeholder="what's on your mind amigo?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
        style={{ width: "100%", padding: "1rem", borderRadius: "1rem", border: "1px solid #ccc", backgroundColor: "#fff", color: "#FF6B6B", fontFamily: "Comfortaa, sans-serif", fontSize: "1rem", resize: "none" }}
      />

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <select
          multiple
          value={taggedAmigos}
          onChange={(e) => setTaggedAmigos(Array.from(e.target.selectedOptions, option => option.value))}
          style={{ flex: 1, padding: "0.6rem", borderRadius: "1rem", fontFamily: "Comfortaa, sans-serif", fontSize: "0.95rem", border: "1px solid #ccc", backgroundColor: "#fff", color: "#444", minWidth: "48%" }}
        >
          <option disabled value="">Tag amigos</option>
          {allAmigos.map(a => <option key={a.id} value={a.id}>{a.displayName || a.email}</option>)}
        </select>

        <select
          multiple
          value={taggedGrupos}
          onChange={(e) => setTaggedGrupos(Array.from(e.target.selectedOptions, option => option.value))}
          style={{ flex: 1, padding: "0.6rem", borderRadius: "1rem", fontFamily: "Comfortaa, sans-serif", fontSize: "0.95rem", border: "1px solid #ccc", backgroundColor: "#fff", color: "#444", minWidth: "48%" }}
        >
          <option disabled value="">Tag grupos</option>
          {allGrupos.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select>
      </div>

      {!isEdit && (
        <>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{ fontSize: "1.5rem", backgroundColor: "transparent", border: "none", cursor: "pointer", animation: "pulse 2s infinite", color: "#FF6B6B" }}
            >📸 / 🎥</button>
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
                <img src={URL.createObjectURL(file)} alt="Preview" style={{ maxWidth: "100%", maxHeight: "200px", objectFit: "cover", borderRadius: "1rem", marginBottom: "1rem" }} />
              ) : (
                <video src={URL.createObjectURL(file)} controls style={{ maxWidth: "100%", maxHeight: "240px", borderRadius: "1rem", marginBottom: "1rem" }} />
              )}
            </div>
          )}
        </>
      )}

      <button type="submit" disabled={loading} style={{ width: "100%", backgroundColor: "#FFFFFF", color: "#FF6B6B", padding: "0.9rem", border: "1px solid #FF6B6B", borderRadius: "9999px", fontWeight: "bold", fontFamily: "Comfortaa, sans-serif", fontSize: "1rem", cursor: "pointer", transition: "0.2s ease-in-out" }}>
        {loading ? (isEdit ? "Saving..." : "Posting...") : isEdit ? "Save Changes" : "Post"}
      </button>
    </form>
  );
};

export default PostForm;