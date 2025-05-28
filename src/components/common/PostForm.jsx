// ✅ Clean + Auth-Checked PostForm Component with Accessibility Fixes
import React, { useState, useRef, useEffect } from "react";
import { db, auth, storage } from "../../firebase";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import InlineNotification from "./InlineNotification"; // Import InlineNotification

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
  const [notification, setNotification] = useState({ message: '', type: '' }); // State for notification

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

  const uploadMediaToStorage = async (file) => {
    const fileRef = ref(storage, `posts/${Date.now()}_${file.name}`);
    await uploadBytes(fileRef, file);
    return await getDownloadURL(fileRef);
  };

  const handlePost = async (e) => {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed && !file) {
      setNotification({ message: "Add text or media to your post.", type: "warning" });
      return;
    }
    setNotification({ message: '', type: '' }); // Clear notification

    const currentUser = auth.currentUser;

    if (!currentUser) {
      return onAuthStateChanged(auth, async (user) => {
        if (!user) {
          setNotification({ message: "You must be logged in to post.", type: "error" });
          return;
        }
        await submitPost(user.uid);
      });
    }

    await submitPost(currentUser.uid);
  };

  const submitPost = async (uid) => {
    setLoading(true);
    let imageUrl = "";
    let videoUrl = "";

    try {
      const mediaType = file ? (file.type.startsWith("video") ? "video" : "image") : "";

      if (file) {
        const url = await uploadMediaToStorage(file);
        if (mediaType === "image") imageUrl = url;
        if (mediaType === "video") videoUrl = url;
      }

      if (isEdit) {
        const postRef = doc(db, "posts", post.id);
        await updateDoc(postRef, {
          content: content.trim(),
          hashtags: extractHashtags(content),
          taggedAmigos,
          taggedGrupos,
          updatedAt: serverTimestamp(),
        });
        setNotification({ message: "Post updated successfully!", type: "success"});
      } else {
        await addDoc(collection(db, "posts"), {
          content: content.trim(),
          userId: uid,
          createdAt: serverTimestamp(),
          emojis: {},
          likes: [],
          dislikes: [],
          hashtags: extractHashtags(content),
          imageUrl,
          videoUrl,
          taggedAmigos,
          taggedGrupos,
          type: "amigo", // Assuming default type, can be dynamic if needed
        });
        setNotification({ message: "Post created successfully!", type: "success"});
      }

      if (typeof onClose === "function") {
        setTimeout(() => onClose(), 1500); // Close modal after showing success message
      }
    } catch (err) {
      console.error("Post failed:", err);
      setNotification({ message: `Post failed: ${err.message}`, type: "error"});
    }

    setLoading(false);
  };
  
  // Define Tailwind classes
  const formClasses = "flex flex-col gap-4 bg-white p-6 rounded-[1.5rem] shadow-[0_5px_25px_rgba(0,0,0,0.1)] z-0 font-comfortaa";
  const textareaClasses = "w-full p-4 rounded-xl border border-gray-300 bg-white text-coral placeholder-coral/70 text-base resize-none focus:ring-2 focus:ring-coral focus:border-transparent";
  const selectClasses = "flex-1 p-2.5 rounded-xl font-comfortaa text-sm border border-gray-300 bg-white text-gray-700 min-w-[48%] focus:ring-2 focus:ring-coral focus:border-transparent";
  const fileButtonClasses = "text-2xl bg-transparent border-none cursor-pointer animate-pulse text-coral hover:text-coral-dark";
  const submitButtonClasses = "w-full bg-coral text-white py-3 px-6 rounded-full font-comfortaa font-bold text-base cursor-pointer transition-all duration-200 ease-in-out shadow-md hover:bg-coral-dark disabled:opacity-50 disabled:cursor-not-allowed";
  const mediaPreviewClasses = "max-w-full max-h-48 sm:max-h-52 object-cover rounded-xl mb-4";


  return (
    <form onSubmit={handlePost} className={formClasses}>
      {notification.message && (
        <div className="mb-2">
          <InlineNotification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification({ message: '', type: '' })}
          />
        </div>
      )}
      <textarea
        id="post-content"
        name="content"
        placeholder="what's on your mind amigo?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
        className={textareaClasses}
      />

      <div className="flex gap-4 flex-wrap">
        <select
          id="tagged-amigos"
          name="taggedAmigos"
          multiple
          value={taggedAmigos}
          onChange={(e) => setTaggedAmigos(Array.from(e.target.selectedOptions, option => option.value))}
          className={selectClasses}
        >
          <option disabled value="">Tag amigos</option>
          {allAmigos.map(a => <option key={a.id} value={a.id}>{a.displayName || a.email}</option>)}
        </select>

        <select
          id="tagged-grupos"
          name="taggedGrupos"
          multiple
          value={taggedGrupos}
          onChange={(e) => setTaggedGrupos(Array.from(e.target.selectedOptions, option => option.value))}
          className={selectClasses}
        >
          <option disabled value="">Tag grupos</option>
          {allGrupos.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select>
      </div>

      {!isEdit && (
        <>
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={fileButtonClasses}
            >📸 / 🎥</button>
          </div>

          <input
            id="post-media"
            name="media"
            type="file"
            ref={fileInputRef}
            accept="image/*,video/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="hidden"
          />

          {file && (
            <div className="text-center">
              {file.type.startsWith("image") ? (
                <img src={URL.createObjectURL(file)} alt="Preview" className={mediaPreviewClasses} />
              ) : (
                <video src={URL.createObjectURL(file)} controls className={mediaPreviewClasses} />
              )}
            </div>
          )}
        </>
      )}

      <button type="submit" disabled={loading} className={submitButtonClasses}>
        {loading ? (isEdit ? "Saving..." : "Posting...") : isEdit ? "Save Changes" : "Post"}
      </button>
    </form>
  );
};

export default PostForm;
