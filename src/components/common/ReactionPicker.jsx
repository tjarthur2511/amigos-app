// src/components/common/ReactionPicker.jsx
import React from "react";

const emojis = ["👍", "👎", "❤️", "😂", "😢", "🔥", "😮"];

const ReactionPicker = ({ onSelect }) => {
  return (
    <div
      className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white rounded-xl shadow-lg p-2 flex space-x-2 z-[9999]"
      style={{ overflowX: "auto", maxWidth: "90vw" }}
    >
      {emojis.map((emoji) => (
        <button
          key={emoji}
          onClick={() => onSelect(emoji)}
          className="text-2xl hover:scale-125 transition-transform"
        >
          {emoji}
        </button>
      ))}
    </div>
  );
};

export default ReactionPicker;
