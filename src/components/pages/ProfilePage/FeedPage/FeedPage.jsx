// src/components/pages/FeedPage/FeedPage.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const FeedPage = () => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-[#FF6B6B] text-white font-[Comfortaa] flex flex-col items-center justify-center px-6 py-12 text-center"
    >
      <h1 className="text-4xl md:text-5xl font-bold lowercase mb-6">
        {t("feed") || "your amigos feed 📰"}
      </h1>

      <p className="text-lg max-w-2xl lowercase leading-relaxed">
        this is where you’ll discover new posts from amigos, rsvp for events, and find new adventures. 
        stay tuned, we’re building your feed experience! 🚀
      </p>

      {/* 🛠 Future: Insert posts, events, amigos' activities here */}
    </motion.div>
  );
};

export default FeedPage;
