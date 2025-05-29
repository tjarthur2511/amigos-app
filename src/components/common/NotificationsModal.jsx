// src/components/common/NotificationsModal.jsx
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
    const cat = n.category || "general";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(n);
  });

  return (
    // Backdrop
    <div className="fixed inset-0 bg-black/60 z-[10000] flex items-center justify-center font-comfortaa p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.25 }}
        // Modal container
        className="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] p-6 sm:p-8 shadow-xl relative overflow-y-auto"
      >
        {/* Close Button - Styled with Tailwind, consistent with PostDetailModal close button */}
        <button
          onClick={onClose}
          aria-label="Close notifications"
          className="absolute top-4 right-4 text-neutral-500 hover:text-coral focus:outline-none focus:ring-2 focus:ring-coral rounded-md p-1 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Main Title */}
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-coral mb-6">
          Notifications
        </h2>

        {notifications.length === 0 && (
          <p className="text-center text-neutral-500 py-8">You have no notifications.</p>
        )}

        {Object.keys(grouped).map((cat) => {
          if (grouped[cat].length === 0) return null; // Don't render empty categories

          return (
            <div key={cat} className="mb-6">
              {/* Category Title */}
              <h3 className="text-lg font-semibold text-coral border-b-2 border-coral pb-1 mb-3 capitalize">
                {cat}
              </h3>
              <ul className="list-none p-0 m-0 space-y-3">
                {/* Displaying all notifications, not just first 10. Logic for seen status can be added. */}
                {grouped[cat].map((n) => (
                  <li
                    key={n.id} // Use notification ID as key
                    // Basic styling for list items - using neutral colors for now
                    // Added seen status visual cue (opacity)
                    className={`flex items-start p-3 rounded-lg shadow bg-neutral-50 hover:bg-neutral-100 transition-colors ${n.seen ? 'opacity-75' : ''}`}
                  >
                    {/* Sender Initial/Icon */}
                    <div className="w-10 h-10 rounded-full bg-coral text-white flex items-center justify-center font-bold text-lg mr-3 shrink-0">
                      {/* Placeholder for sender image or better icon logic */}
                      {n.senderProfile?.displayName?.[0]?.toUpperCase() || n.type?.[0]?.toUpperCase() || '!'}
                    </div>
                    {/* Notification Content */}
                    <div className="flex-1">
                      <p className="m-0 text-sm text-charcoal leading-snug">{n.content || n.message}</p>
                      <small className="text-xs text-neutral-500">
                        {n.type || "info"} – {new Date(n.createdAt?.seconds * 1000).toLocaleDateString()} {new Date(n.createdAt?.seconds * 1000).toLocaleTimeString()}
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