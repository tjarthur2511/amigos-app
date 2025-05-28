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
import InlineNotification from "./InlineNotification"; // Import InlineNotification

const GoLiveModal = ({ onClose }) => {
  const { currentUser } = useAuth();
  const [isLive, setIsLive] = useState(false);
  const [streamId, setStreamId] = useState(null);
  const [hostId, setHostId] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [cameraError, setCameraError] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' }); // Notification state

  const videoRef = useRef(null);
  const mediaStream = useRef(null);

  const handleStartLive = async () => {
    setNotification({ message: '', type: '' }); // Clear notification
    if (!currentUser) {
      setNotification({ message: "Sign in to go live.", type: "warning" });
      return;
    }

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

  // Define Tailwind classes
  const modalOverlayClasses = "fixed inset-0 bg-black/60 z-[10000000] flex items-center justify-center font-comfortaa";
  const modalContainerBaseClasses = "rounded-[1.5rem] p-8 w-[95%] max-w-2xl max-h-[90vh] overflow-y-auto relative shadow-2xl z-[10000001] flex flex-col gap-4"; // max-w-2xl for 680px approx
  const modalContainerLiveClasses = "bg-coral text-white";
  const modalContainerNotLiveClasses = "bg-white text-charcoal";
  const closeModalButtonClasses = "absolute top-4 right-4 text-2xl bg-transparent border-none cursor-pointer";
  const titleClasses = "text-center text-2xl font-bold"; // text-2xl for 1.75rem approx
  const visibilitySelectClasses = "py-1.5 px-4 rounded-full font-comfortaa border border-gray-300 focus:ring-2 focus:ring-coral";
  const videoContainerClasses = "bg-black rounded-xl h-60 mb-4 flex items-center justify-center text-center";
  const videoElementClasses = "w-full h-full object-cover rounded-xl";
  const controlButtonClasses = "py-2.5 px-6 rounded-full border-none font-bold transition-colors duration-150";
  const startButtonClasses = `${controlButtonClasses} bg-coral text-white hover:bg-coral-dark`;
  const stopButtonClasses = `${controlButtonClasses} bg-white text-coral hover:bg-blush`;
  const commentsContainerClasses = "max-h-36 overflow-y-auto mb-4 border border-gray-200 rounded-lg bg-white text-charcoal p-2 space-y-1";
  const commentItemClasses = "py-1 px-2 flex justify-between items-center text-sm";
  const deleteCommentButtonClasses = "text-coral hover:text-coral-dark bg-transparent border-none text-lg";
  const commentInputClasses = "flex-1 py-2 px-4 rounded-full border border-gray-300 focus:ring-1 focus:ring-coral outline-none";
  const submitCommentButtonClasses = "bg-coral text-white border-none py-2 px-4 rounded-full font-bold hover:bg-coral-dark transition-colors";


  return (
    <div className={modalOverlayClasses}>
      <div className={`${modalContainerBaseClasses} ${isLive ? modalContainerLiveClasses : modalContainerNotLiveClasses}`}>
        <button
          onClick={onClose}
          className={`${closeModalButtonClasses} ${isLive ? 'text-white hover:text-gray-200' : 'text-coral hover:text-coral-dark'}`}
        >
          ✕
        </button>

        <h2 className={`${titleClasses} ${isLive ? 'text-white' : 'text-coral'}`}>
          go live
        </h2>

        {notification.message && (
          <div className={isLive ? 'bg-white/20 p-2 rounded-lg' : ''}> {/* Adjust notification style if live */}
            <InlineNotification
              message={notification.message}
              type={notification.type}
              onClose={() => setNotification({ message: '', type: '' })}
            />
          </div>
        )}

        {!isLive && (
          <div className="text-center mb-4">
            <label className={`mr-2 ${isLive ? 'text-white' : 'text-charcoal'}`}>Visibility:</label>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
              className={visibilitySelectClasses}
            >
              <option value="public">Public</option>
              <option value="followers" disabled>
                Followers (coming soon)
              </option>
            </select>
          </div>
        )}

        <div className={videoContainerClasses}>
          {!cameraError && isLive ? (
            <video ref={videoRef} muted playsInline className={videoElementClasses} />
          ) : cameraError ? (
            <span className="text-white font-bold p-4">
              🎥 Camera not available. Please check permissions.
            </span>
          ) : (
            <span className="text-coral font-bold">Waiting to go live...</span>
          )}
        </div>

        <div className="text-center mb-4">
          {!isLive ? (
            <button
              onClick={handleStartLive}
              className={startButtonClasses}
            >
              Start Live
            </button>
          ) : (
            <button
              onClick={handleStopLive}
              className={stopButtonClasses}
            >
              Stop Live
            </button>
          )}
        </div>

        <div className={commentsContainerClasses}>
          {comments.map((c) => (
            <div
              key={c.id}
              className={commentItemClasses}
            >
              <span>
                <strong className={isLive ? 'text-white/80' : 'text-coral'}>{c.username}:</strong> {c.content}
              </span>
              {(currentUser?.uid === c.userId || currentUser?.uid === hostId) && (
                <button
                  onClick={() => handleDeleteComment(c.id, c.userId)}
                  className={deleteCommentButtonClasses}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Leave a comment..."
            className={commentInputClasses}
            disabled={!isLive && !streamId} // Disable if not live or no stream
          />
          <button
            onClick={handleCommentSubmit}
            className={submitCommentButtonClasses}
            disabled={!isLive && !streamId} // Disable if not live or no stream
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoLiveModal;
