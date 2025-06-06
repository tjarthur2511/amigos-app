// src/components/pages/Live/LiveSuggestions.jsx
import React from "react";
import { motion } from "framer-motion";

const LiveSuggestions = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col items-center space-y-6 mt-6 font-comfortaa" // Added font-comfortaa
    >
      <h2 className="text-3xl font-bold text-coral">Suggested Streams</h2> {/* Used text-coral */}
      <p className="text-gray-600 text-center max-w-md">
        We're working on suggesting streams and live events you’ll love. Stay tuned, amigo!
      </p>
    </motion.div>
  );
};

export default LiveSuggestions;
