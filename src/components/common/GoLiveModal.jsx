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
  getDoc,
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
  const [cameraError, setCameraError] = useState(false);

  const videoRef = useRef(null);
  const mediaStream = useRef(null);

  const handleStartLive = async () => {
    if (!currentUser) return alert("Sign in to go live.");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      mediaStream.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
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
    } catch (err) {
      console.error("🚨 Camera access failed:", err);
      setCameraError(true);
    }
  };

  const handleStopLive = async () => {
    if (!streamId) return;
    try {
      await updateDoc(doc(db, "livestreams", streamId), {
        isLive: false,
        endedAt: serverTimestamp(),
      });
      mediaStream.current?.getTracks().forEach((t) => t.stop());
      setIsLive(false);
      setStreamId(null);
    } catch (err) {
      console.error("Stop Live Error:", err);
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
      console.error("Submit Comment Error:", err);
    }
  };

  const handleDeleteComment = async (id, userId) => {
    const canDelete = currentUser?.uid === userId || currentUser?.uid === hostId;
    if (!canDelete) return;
    try {
      await deleteDoc(doc(db, "livestreams", streamId, "comments", id));
    } catch (err) {
      console.error("Delete Comment Error:", err);
    }
  };

  useEffect(() => {
    if (!streamId) return;

    getDoc(doc(db, "livestreams", streamId)).then((d) => {
      if (d.exists()) setHostId(d.data().userId);
    });

    const unsub = onSnapshot(collection(db, "livestreams", streamId, "comments"), (snap) => {
      const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setComments(data.sort((a, b) => a.createdAt?.seconds - b.createdAt?.seconds));
    });

    return () => unsub();
  }, [streamId]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.6)",
        zIndex: 10000000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Comfortaa, sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: isLive ? "#FF6B6B" : "#fff",
          color: isLive ? "#fff" : "#333",
          borderRadius: "1.5rem",
          padding: "2rem",
          width: "95%",
          maxWidth: "680px",
          maxHeight: "90vh",
          overflowY: "auto",
          position: "relative",
          boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
          zIndex: 10000001,
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            fontSize: "1.5rem",
            color: "#FF6B6B",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          ✕
        </button>

        <h2
          style={{
            textAlign: "center",
            fontSize: "1.75rem",
            marginBottom: "1.5rem",
            color: isLive ? "#fff" : "#FF6B6B",
          }}
        >
          go live
        </h2>

        {!isLive && (
          <div style={{ textAlign: "center", marginBottom: "1rem" }}>
            <label style={{ marginRight: "0.5rem" }}>Visibility:</label>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
              style={{
                padding: "0.4rem 1rem",
                borderRadius: "9999px",
                fontFamily: "Comfortaa, sans-serif",
              }}
            >
              <option value="public">Public</option>
              <option value="followers" disabled>
                Followers (coming soon)
              </option>
            </select>
          </div>
        )}

        <div
          style={{
            backgroundColor: "#000",
            borderRadius: "1rem",
            height: "240px",
            marginBottom: "1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {!cameraError && isLive ? (
            <video ref={videoRef} muted playsInline style={{ width: "100%", height: "100%" }} />
          ) : cameraError ? (
            <span style={{ color: "#fff", fontWeight: "bold" }}>
              🎥 Camera not available. Please check permissions.
            </span>
          ) : (
            <span style={{ color: "#FF6B6B", fontWeight: "bold" }}>Waiting to go live...</span>
          )}
        </div>

        <div style={{ textAlign: "center", marginBottom: "1rem" }}>
          {!isLive ? (
            <button
              onClick={handleStartLive}
              style={{
                backgroundColor: "#FF6B6B",
                color: "white",
                padding: "0.6rem 1.5rem",
                borderRadius: "9999px",
                border: "none",
                fontWeight: "bold",
              }}
            >
              Start Live
            </button>
          ) : (
            <button
              onClick={handleStopLive}
              style={{
                backgroundColor: "#fff",
                color: "#FF6B6B",
                padding: "0.6rem 1.5rem",
                borderRadius: "9999px",
                border: "none",
                fontWeight: "bold",
              }}
            >
              Stop Live
            </button>
          )}
        </div>

        <div
          style={{
            maxHeight: "150px",
            overflowY: "auto",
            marginBottom: "1rem",
            border: "1px solid #eee",
            borderRadius: "0.75rem",
            backgroundColor: "#fff",
            color: "#333",
          }}
        >
          {comments.map((c) => (
            <div
              key={c.id}
              style={{
                padding: "0.5rem 1rem",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>
                <strong>{c.username}:</strong> {c.content}
              </span>
              {(currentUser?.uid === c.userId || currentUser?.uid === hostId) && (
                <button
                  onClick={() => handleDeleteComment(c.id, c.userId)}
                  style={{
                    color: "#FF6B6B",
                    background: "none",
                    border: "none",
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Leave a comment..."
            style={{
              flex: 1,
              padding: "0.5rem 1rem",
              borderRadius: "9999px",
              border: "1px solid #ccc",
            }}
          />
          <button
            onClick={handleCommentSubmit}
            style={{
              backgroundColor: "#FF6B6B",
              color: "white",
              border: "none",
              padding: "0.5rem 1rem",
              borderRadius: "9999px",
              fontWeight: "bold",
            }}
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoLiveModal;
