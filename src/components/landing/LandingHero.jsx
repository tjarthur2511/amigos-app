// src/components/landing/LandingHero.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnimatedAmigoLogo from './AnimatedAmigoLogo.jsx'; // ✅ import it

const LandingHero = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/signup');
  };

  return (
    <section className="flex flex-col items-center justify-center text-center bg-[#FF6B6B] text-white p-10 min-h-[60vh] overflow-hidden">
      <AnimatedAmigoLogo /> {/* ✅ add it right here */}
      
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-4xl md:text-6xl font-bold mb-4"
      >
        Amigos Await!
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="text-lg md:text-2xl max-w-2xl mb-8"
      >
        Real Friends. Real Adventures.  
        Find your next Amigo today — a community built for real friendships, not just followers.
      </motion.p>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleGetStarted}
        className="px-8 py-3 bg-white text-[#FF6B6B] font-semibold rounded-2xl shadow-md hover:bg-gray-100 transition-all text-lg"
      >
        Find Amigos
      </motion.button>
    </section>
  );
};

export default LandingHero;
