// src/components/pages/Live/LiveFeed.jsx
import React from "react";
import { motion } from "framer-motion";

const liveEvents = [
  {
    id: 1,
    title: "Hiking at Monroe Park",
    host: "LunaBot",
    time: "Now Live",
  },
  {
    id: 2,
    title: "Coffee Meetup Downtown",
    host: "ZenMaster",
    time: "Starting Soon",
  },
  {
    id: 3,
    title: "Online Game Night",
    host: "NovaPlays",
    time: "Now Live",
  },
];

const LiveFeed = () => {
  return (
    <div className="flex flex-col items-center space-y-6">
      <h2 className="text-3xl font-bold text-[#FF6B6B]">Live Feed</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
        {liveEvents.map((event) => (
          <div
            key={event.id}
            className="relative border rounded-2xl p-6 shadow-lg bg-white hover:shadow-xl transition-all flex flex-col space-y-2"
          >
            {/* Pulsing Live Icon */}
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="absolute top-4 right-4 w-6 h-6"
            >
              <img
                src="/assets/amigos-a-logo.png" // 🔥 Static correct path
                alt="Live"
                className="w-full h-full rounded-full"
              />
            </motion.div>

            <h3 className="text-2xl font-bold text-[#FF6B6B]">{event.title}</h3>
            <p className="text-gray-700">Hosted by: {event.host}</p>
            <p className="text-gray-500">{event.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveFeed;
