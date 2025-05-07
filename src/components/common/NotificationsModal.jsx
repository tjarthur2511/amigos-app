import React from "react";
import { motion } from "framer-motion";

const NotificationsModal = ({ notifications, onClose }) => {
  const grouped = {
    amigos: [],
    grupos: [],
    live: [],
    comment: [],
    emoji: [],
  };

  notifications.forEach((n) => {
    if (grouped[n.category]) {
      grouped[n.category].push(n);
    }
  });

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        zIndex: 1000000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Comfortaa, sans-serif",
        padding: "1rem",
      }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.25 }}
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "1.5rem",
          width: "100%",
          maxWidth: "540px",
          maxHeight: "85vh",
          padding: "2rem",
          boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
          position: "relative",
          overflowY: "auto",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            fontSize: "1.4rem",
            color: "#FF6B6B",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "6px 12px",
            borderRadius: "9999px",
            transition: "all 0.2s ease-in-out",
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = "#FF6B6B";
            e.target.style.color = "#fff";
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = "transparent";
            e.target.style.color = "#FF6B6B";
          }}
        >
          ✕
        </button>

        <h2
          style={{
            fontSize: "1.8rem",
            marginBottom: "1.2rem",
            textAlign: "center",
            color: "#FF6B6B",
          }}
        >
          Notifications
        </h2>

        {Object.keys(grouped).map((cat) => (
          <div key={cat} style={{ marginBottom: "1.5rem" }}>
            <h3
              style={{
                fontSize: "1rem",
                color: "#FF6B6B",
                borderBottom: "2px solid #FF6B6B",
                paddingBottom: "0.3rem",
                marginBottom: "0.8rem",
                textTransform: "capitalize",
              }}
            >
              {cat}
            </h3>
            {grouped[cat].length === 0 ? (
              <p style={{ fontSize: "0.9rem", color: "#999" }}>
                No new {cat} notifications.
              </p>
            ) : (
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {grouped[cat].slice(0, 10).map((n, i) => (
                  <li
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "0.9rem",
                      background: "#FFF5F5",
                      borderRadius: "1rem",
                      padding: "0.7rem 1rem",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                    }}
                  >
                    <div
                      style={{
                        width: "42px",
                        height: "42px",
                        borderRadius: "9999px",
                        backgroundColor: "#FF6B6B",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                        fontSize: "1.2rem",
                        marginRight: "1rem",
                      }}
                    >
                      {n.senderId?.[0]?.toUpperCase() || "?"}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontSize: "0.95rem" }}>{n.content}</p>
                      <small style={{ color: "#999", fontSize: "0.75rem" }}>
                        {n.type} – {n.category}
                      </small>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default NotificationsModal;
