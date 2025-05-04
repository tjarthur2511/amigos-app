// src/components/common/GoLiveModal.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  onSnapshot,
  getDoc
} from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";

const GoLiveModal = ({ onClose }) => {
  const { currentUser } = useAuth();
  const [isLive, setIsLive] = useState(false);
  const [streamId, setStreamId] = useState(null);
  const [hostId, setHostId] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [visibility, setVisibility] = useState("public");

  const videoRef = useRef(null);
  const mediaStream = useRef(null);

  const handleStartLive = async () => {
    try {
      if (!currentUser) {
        alert("You must be signed in to go live.");
        return;
      }

      const docRef = await addDoc(collection(db, "livestreams"), {
        userId: currentUser.uid,
        username: currentUser.displayName || "Anonymous",
        isLive: true,
        startedAt: serverTimestamp(),
        endedAt: null,
        visibility,
      });

      setStreamId(docRef.id);
      setHostId(currentUser.uid);
      setIsLive(true);

      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      mediaStream.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error("Start Live Error:", error);
      alert("Could not start livestream: " + error.message);
    }
  };

  const handleStopLive = async () => {
    if (!streamId) return;

    try {
      await updateDoc(doc(db, "livestreams", streamId), {
        isLive: false,
        endedAt: serverTimestamp(),
      });

      if (mediaStream.current) {
        mediaStream.current.getTracks().forEach((track) => track.stop());
        mediaStream.current = null;
      }

      setIsLive(false);
      setStreamId(null);
    } catch (error) {
      console.error("Stop Live Error:", error);
      alert("Failed to stop livestream.");
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim() || !streamId || !currentUser) return;

    try {
      await addDoc(collection(db, "livestreams", streamId, "comments"), {
        userId: currentUser.uid,
        username: currentUser.displayName || "Anonymous",
        content: newComment,
        emoji: "💬",
        createdAt: serverTimestamp(),
      });
      setNewComment("");
    } catch (err) {
      console.error("Comment submit error:", err);
    }
  };

  const handleDeleteComment = async (commentId, commentUserId) => {
    const canDelete =
      currentUser?.uid === commentUserId || currentUser?.uid === hostId;

    if (!canDelete) return;

    try {
      await deleteDoc(doc(db, "livestreams", streamId, "comments", commentId));
    } catch (err) {
      console.error("Comment delete error:", err);
      alert("Failed to delete comment.");
    }
  };

  useEffect(() => {
    if (!streamId) return;

    const fetchHostId = async () => {
      const streamDoc = await getDoc(doc(db, "livestreams", streamId));
      if (streamDoc.exists()) {
        setHostId(streamDoc.data().userId);
      }
    };

    fetchHostId();

    const commentRef = collection(db, "livestreams", streamId, "comments");
    const unsub = onSnapshot(commentRef, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setComments(data.sort((a, b) => a.createdAt?.seconds - b.createdAt?.seconds));
    });

    return () => unsub();
  }, [streamId]);

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 10001,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "1rem", overflowY: "auto"
    }}>
      <div style={{
        backgroundColor: "white", borderRadius: "1.5rem", padding: "2rem",
        width: "100%", maxWidth: "640px", maxHeight: "90vh", overflowY: "auto",
        boxShadow: "0 10px 30px rgba(0,0,0,0.3)", fontFamily: "Comfortaa, sans-serif",
        position: "relative"
      }}>
        <button onClick={onClose} style={{
          position: "absolute", top: "1rem", right: "1rem",
          fontSize: "1.5rem", fontWeight: "bold", color: "#FF6B6B",
          background: "transparent", border: "none", cursor: "pointer"
        }}>✕</button>

        {isLive && (
          <div style={{
            position: "absolute", top: "8rem", right: "5rem",
            backgroundColor: "#FF6B6B", color: "white",
            padding: "0.4rem 0.8rem", borderRadius: "9999px",
            fontWeight: "bold", fontFamily: "Comfortaa, sans-serif",
            animation: "pulse 1.5s infinite", zIndex: 10
          }}>a</div>
        )}

        <h2 style={{ fontSize: "1.75rem", fontWeight: "bold", color: "#FF6B6B", marginBottom: "1.5rem", textAlign: "center", textTransform: "lowercase" }}>
          go live
        </h2>

        {!isLive && (
          <div style={{ marginBottom: "1rem", textAlign: "center" }}>
            <label style={{ fontSize: "0.9rem", color: "#555", marginRight: "0.5rem" }}>Visibility:</label>
            <select value={visibility} onChange={(e) => setVisibility(e.target.value)} style={{
              padding: "0.3rem 0.7rem", borderRadius: "9999px", border: "1px solid #ccc", fontFamily: "Comfortaa, sans-serif"
            }}>
              <option value="public">Public</option>
              <option value="followers" disabled>Followers (coming soon)</option>
            </select>
          </div>
        )}

        <div style={{
          width: "100%", height: "240px", backgroundColor: "#000",
          borderRadius: "1rem", marginBottom: "1rem", overflow: "hidden", position: "relative"
        }}>
          {!isLive ? (
            <div style={{
              height: "100%", display: "flex", alignItems: "center", justifyContent: "center",
              color: "#FF6B6B", fontWeight: "bold", fontSize: "1.1rem"
            }}>
              Waiting to go live...
            </div>
          ) : (
            <video ref={videoRef} muted playsInline style={{
              width: "100%", height: "100%", objectFit: "contain",
              backgroundColor: "black", borderRadius: "1rem"
            }} />
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginBottom: "1rem" }}>
          {!isLive ? (
            <button onClick={handleStartLive} style={{
              backgroundColor: "#FF6B6B", color: "white", padding: "0.5rem 1rem",
              borderRadius: "9999px", border: "none", cursor: "pointer", fontWeight: "bold"
            }}>Start Live</button>
          ) : (
            <button onClick={handleStopLive} style={{
              backgroundColor: "#ccc", color: "#333", padding: "0.5rem 1rem",
              borderRadius: "9999px", border: "none", cursor: "pointer", fontWeight: "bold"
            }}>Stop Live</button>
          )}
        </div>

        <div style={{
          maxHeight: "150px", overflowY: "auto", marginBottom: "1rem",
          border: "1px solid #eee", borderRadius: "0.75rem"
        }}>
          {comments.map((comment) => (
            <div key={comment.id} style={{
              padding: "0.5rem 1rem", borderBottom: "1px solid #eee",
              color: "#555", fontSize: "0.95rem", display: "flex",
              justifyContent: "space-between", alignItems: "center"
            }}>
              <span><strong>{comment.username}:</strong> {comment.content}</span>
              {(currentUser?.uid === comment.userId || currentUser?.uid === hostId) && (
                <button onClick={() => handleDeleteComment(comment.id, comment.userId)} style={{
                  background: "transparent", border: "none", color: "#FF6B6B",
                  fontSize: "1rem", cursor: "pointer"
                }} title="Delete comment">✕</button>
              )}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Leave a comment..." style={{
            flex: 1, padding: "0.5rem 1rem", borderRadius: "9999px",
            border: "1px solid #ccc", fontFamily: "Comfortaa, sans-serif"
          }} />
          <button onClick={handleCommentSubmit} style={{
            backgroundColor: "#FF6B6B", color: "white", border: "none",
            padding: "0.5rem 1rem", borderRadius: "9999px", cursor: "pointer", fontWeight: "bold"
          }}>➤</button>
        </div>
      </div>
    </div>
  );
};

export default GoLiveModal;
