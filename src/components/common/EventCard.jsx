// src/components/common/EventCard.jsx
import React from "react";
import { Timestamp } from "firebase/firestore";

const formatDate = (ts) => {
  if (!(ts instanceof Timestamp)) return "Date TBD";
  const date = ts.toDate();
  return date.toLocaleDateString() + " @ " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const EventCard = ({ event }) => {
  return (
    <div className="bg-white text-[#333] p-4 rounded-xl shadow-md">
      <h3 className="text-xl font-bold text-[#FF6B6B]">{event.title || "Untitled Event"}</h3>
      <p className="text-sm italic text-gray-600 mb-2">{formatDate(event.date)}</p>
      <p className="text-sm">{event.description || "No description provided"}</p>
      {event.location && (
        <p className="text-sm text-gray-500 mt-1">📍 {event.location}</p>
      )}
    </div>
  );
};

export default EventCard;
