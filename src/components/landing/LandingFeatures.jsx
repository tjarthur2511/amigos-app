// src/components/landing/LandingFeatures.jsx
import React from 'react';
import { motion } from 'framer-motion'; // ✅ animations

const features = [
  {
    title: "Find Real Friends",
    description: "Discover amigos based on hobbies, passions, and real-world activities.",
    icon: "🎯",
  },
  {
    title: "Join Fun Grupos",
    description: "Create or join groups centered around your favorite adventures.",
    icon: "🌟",
  },
  {
    title: "Live Real Adventures",
    description: "Hang out online or in person with a community built for connection.",
    icon: "🚀",
  },
];

const LandingFeatures = () => {
  return (
    <section className="flex flex-col items-center py-16 bg-white">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-3xl md:text-4xl font-bold mb-10 text-center"
      >
        Why Join Amigos?
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl w-full px-6">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.2, duration: 0.6 }}
            whileHover={{ scale: 1.05 }}
            className="flex flex-col items-center text-center p-8 rounded-2xl shadow-md hover:shadow-2xl transition-all bg-gray-50"
          >
            <div className="text-5xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default LandingFeatures;
