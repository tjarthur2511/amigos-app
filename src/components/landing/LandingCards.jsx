// src/components/landing/LandingCards.jsx
import React from "react";
import { motion } from "framer-motion";

const tasks = [
  {
    title: "Finish Your Profile",
    description: "Add your name, photo, location, and preferred language to complete your profile.",
    icon: "👤",
  },
  {
    title: "Complete Your Quiz",
    description: "Answer a few quick questions to help match you with future Amigos.",
    icon: "📝",
  },
  {
    title: "Find Your First Amigo",
    description: "Browse suggested amigos based on your hobbies and activities.",
    icon: "🤝",
  },
  {
    title: "Join a Grupo",
    description: "Find or create a Grupo based on your favorite activities.",
    icon: "🌎",
  },
];

const LandingCards = () => {
  return (
    <section className="flex flex-col items-center py-16 bg-gray-50">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-3xl md:text-4xl font-bold mb-10 text-center"
      >
        Get Started in 4 Easy Steps
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl w-full px-6">
        {tasks.map((task, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.2, duration: 0.6 }}
            whileHover={{ scale: 1.05 }}
            className="flex flex-col items-center text-center bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all"
          >
            <div className="text-5xl mb-4">{task.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{task.title}</h3>
            <p className="text-gray-600">{task.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default LandingCards;
