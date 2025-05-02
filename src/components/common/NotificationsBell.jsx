import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const NotificationsBell = () => {
  const [shouldPulse, setShouldPulse] = useState(false);

  useEffect(() => {
    const checkNotifications = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        setShouldPulse(data.hasUnseenReactions || false);
      }
    };
    checkNotifications();
  }, []);

  const handleClick = async () => {
    const user = auth.currentUser;
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, { hasUnseenReactions: false });
    setShouldPulse(false);
    alert("Notifications panel coming soon!");
  };

  return (
    <button
      onClick={handleClick}
      style={{
        position: "absolute",
        top: "12.25rem",
        left: "50%",
        transform: "translateX(15rem)",
        backgroundColor: "#FFFFFF",
        color: "#FF6B6B",
        border: "none",
        padding: "0.4rem 1rem",
        borderRadius: "9999px",
        fontSize: "0.9rem",
        fontFamily: "Comfortaa, sans-serif",
        fontWeight: "bold",
        cursor: "pointer",
        boxShadow: "0 3px 8px rgba(0,0,0,0.2)",
        zIndex: 9999,
        animation: shouldPulse ? "pulse 1.5s infinite" : "none",
        transition: "background-color 0.3s ease, color 0.3s ease",
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
  );
};

export default NotificationsBell;
