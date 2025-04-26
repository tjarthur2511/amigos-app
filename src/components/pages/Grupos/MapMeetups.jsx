// src/components/pages/Grupos/MapMeetups.jsx
import React from "react";
import { motion } from "framer-motion";

const MapMeetups = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col items-center space-y-6 mt-6 px-4"
    >
      <h2 className="text-4xl font-bold text-[#FF6B6B] text-center">Map of Meetups</h2>

      <div className="w-full max-w-5xl h-[500px] border rounded-2xl shadow-lg overflow-hidden bg-gray-100 flex items-center justify-center">
        <iframe
          title="Meetup Map"
          width="100%"
          height="100%"
          frameBorder="0"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src="https://www.google.com/maps/embed/v1/view?key=AIzaSyC7L5SFVWN1kWOoLU0Xmcu4nHMEV3KvF8U&center=42.3314,-83.0458&zoom=10"
        ></iframe>
      </div>
    </motion.div>
  );
};

export default MapMeetups;
