// src/components/landing/LandingFooter.jsx
import React from "react";
import { motion } from "framer-motion";

const LandingFooter = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full bg-white text-gray-500 text-sm text-center py-6 mt-12 border-t"
    >
      <p className="mb-2">
        © {new Date().getFullYear()} Amigos. Built with ❤️ for real friendships.
      </p>
      <div className="flex justify-center space-x-6 mt-2 text-sm">
        <a href="#" className="hover:text-[#FF6B6B] hover:underline transition-all">
          About
        </a>
        <a href="#" className="hover:text-[#FF6B6B] hover:underline transition-all">
          Privacy Policy
        </a>
        <a href="#" className="hover:text-[#FF6B6B] hover:underline transition-all">
          Terms
        </a>
      </div>
    </motion.footer>
  );
};

export default LandingFooter;
