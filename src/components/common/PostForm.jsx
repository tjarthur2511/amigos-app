// src/components/common/PostForm.jsx
import React, { useState } from "react";
import { db, auth } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const PostForm = () => {
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!content.trim()) return alert("Write something first!");
    setLoading(true);
    try {
      await addDoc(collection(db, "posts"), {
        content,
        imageUrl,
        userId: auth.currentUser?.uid || "anon",
        createdAt: serverTimestamp(),
        likes: [],
        dislikes: [],
        emojis: {},
      });
      setContent("");
      setImageUrl("");
    } catch (error) {
      console.error("Post failed:", error);
    }
    setLoading(false);
  };

  return (
    <form
      onSubmit={handlePost}
      className="bg-white p-4 rounded-xl shadow-md w-full max-w-2xl mx-auto mt-6 z-10 relative"
    >
      <textarea
        placeholder="what's on your mind amigo?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        className="w-full p-3 border border-gray-300 rounded-xl font-[Comfortaa] text-[#FF6B6B] focus:outline-none focus:ring"
      ></textarea>
      <input
        type="text"
        placeholder="optional image URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        className="w-full mt-2 p-2 border border-gray-300 rounded-xl font-[Comfortaa] text-sm"
      />
      <button
        type="submit"
        disabled={loading}
        className="mt-4 bg-[#FF6B6B] text-white font-bold py-2 px-6 rounded-full hover:bg-[#e15555] transition-all font-[Comfortaa]"
      >
        {loading ? "Posting..." : "Post"}
      </button>
    </form>
  );
};

export default PostForm;
