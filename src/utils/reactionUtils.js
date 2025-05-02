// src/utils/reactionUtils.js
import { db, auth } from "../firebase";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";

export const handleReaction = async (postId, type, value) => {
  if (!auth.currentUser?.uid) return;
  const postRef = doc(db, "posts", postId);
  const field = type === "emoji" ? `emojis.${value}` : type + "s";

  await updateDoc(postRef, {
    [field]: arrayUnion(auth.currentUser.uid)
  });

  // Notify bell pulse flag
  localStorage.setItem("newNotification", "true");
};
