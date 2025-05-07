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
      setNotifications(
        items.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds)
      );
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleClick = async () => {
    setShowModal(true);

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
          top: "12rem",
          right: "29.5rem",
          backgroundColor: "#FF6B6B", // Amigos coral
          border: "none",
          padding: "0.5rem",
          borderRadius: "9999px",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.23)",
          zIndex: 999999,
          animation: unseenCount > 0 ? "pulse 1.5s infinite" : "none",
          transition: "all 0.3s ease",
        }}
        onMouseOver={(e) => {
          e.target.style.backgroundColor = "#e15555";
        }}
        onMouseOut={(e) => {
          e.target.style.backgroundColor = "#FF6B6B";
        }}
      >
        <img
          src="/assets/amigosaonly.png"
          alt="notification a"
          style={{
            height: "1.6rem",
            width: "auto",
            display: "block",
            filter: "drop-shadow(0 0 2px #fff)",
          }}
        />
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
