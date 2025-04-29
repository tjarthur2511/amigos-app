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
      className="flex flex-col items-center space-y-6 mt-6 px-4 font-[Comfortaa]"
    >
      <h1 className="text-4xl font-bold text-[#FF6B6B] lowercase text-center">
        {t("feed") || "your amigos feed 📰"}
      </h1>

      <p className="text-gray-700 text-center max-w-2xl lowercase">
        this is where you’ll discover new posts from amigos, rsvp for events, and find new adventures. 
        stay tuned, we’re building your feed experience! 🚀
      </p>

      {/* 🛠 Future: Insert posts, events, amigos' activities */}
    </motion.div>
  );
};

export default FeedPage;
