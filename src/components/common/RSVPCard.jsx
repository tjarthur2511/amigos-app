// src/components/common/RSVPCard.jsx
import React from "react";
import { Timestamp } from "firebase/firestore";

const formatDate = (ts) => {
  if (!(ts instanceof Timestamp)) return "No time";
  const date = ts.toDate();
  return date.toLocaleDateString() + " @ " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const RSVPCard = ({ rsvp }) => {
  return (
    <div className="bg-white text-[#333] p-4 rounded-xl shadow-md flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[#FF6B6B] font-bold">{rsvp.userName || "Unknown User"}</span>
        <span className="text-sm italic">{formatDate(rsvp.timestamp)}</span>
      </div>
      <p className="text-sm">
        RSVP’d to: <span className="font-semibold">{rsvp.eventTitle || "Unnamed Event"}</span>
      </p>
      {rsvp.notes && <p className="text-xs mt-1 text-gray-600">Note: {rsvp.notes}</p>}
    </div>
  );
};

export default RSVPCard;
