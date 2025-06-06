// src/components/pages/Live/LivePage.jsx
import React, { useState } from "react";
import LiveFeed from "./LiveFeed.jsx"; // 🔥 add .jsx for Vite correct parsing
import LiveSuggestions from "./LiveSuggestions.jsx"; // 🔥 add .jsx for Vite correct parsing
import { motion } from "framer-motion";

const LivePage = () => {
  const [tab, setTab] = useState("feed");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col items-center min-h-screen space-y-6 p-6 bg-gray-50 font-comfortaa" // Added font-comfortaa
    >
      <h1 className="text-4xl font-bold text-coral">Go Live</h1> {/* Used text-coral */}

      <div className="flex flex-wrap justify-center gap-4 mb-6">
        {[
          { id: "feed", label: "Live Feed" },
          { id: "suggested", label: "Suggestions" },
        ].map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            disabled={tab === id}
            className={`px-4 py-2 rounded-full font-semibold transition-all ${
              tab === id
                ? "bg-coral text-white" // Used bg-coral
                : "bg-white text-coral border border-coral" // Used text-coral and border-coral
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="w-full max-w-5xl">
        {tab === "feed" && <LiveFeed />}
        {tab === "suggested" && <LiveSuggestions />}
      </div>
    </motion.div>
  );
};

export default LivePage;
