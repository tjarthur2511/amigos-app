// src/components/common/NotificationsBell.jsx
import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import NotificationsModal from "./NotificationsModal";

const NotificationsBell = () => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, "notifications"),
      where("targetUserId", "==", currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotifications(items.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds));
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleClick = async () => {
    setShowModal(true);

    // Mark all unseen notifications as seen
    const unseen = notifications.filter((n) => !n.seen);
    for (const n of unseen) {
      const ref = doc(db, "notifications", n.id);
      await updateDoc(ref, { seen: true });
    }
  };

  const unseenCount = notifications.filter((n) => !n.seen).length;

  return (
    <>
      <button
        onClick={handleClick}
        style={{
          position: "absolute",
          top: "12.25rem",
          right: "21rem",
          backgroundColor: "#FFFFFF",
          color: "#FF6B6B",
          border: "none",
          padding: "0.5rem 1.1rem",
          borderRadius: "9999px",
          fontSize: "1.25rem",
          fontFamily: "Comfortaa, sans-serif",
          fontWeight: "bold",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
          zIndex: 9999,
          animation: unseenCount > 0 ? "pulse 1.5s infinite" : "none",
          transition: "all 0.3s ease",
        }}
        onMouseOver={(e) => {
          e.target.style.backgroundColor = "#FF6B6B";
          e.target.style.color = "#FFFFFF";
        }}
        onMouseOut={(e) => {
          e.target.style.backgroundColor = "#FFFFFF";
          e.target.style.color = "#FF6B6B";
        }}
      >
        a
      </button>

      {showModal && (
        <NotificationsModal
          notifications={notifications}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default NotificationsBell;
