// src/components/pages/LandingPage.jsx
import React, { Suspense } from 'react';
import { motion } from 'framer-motion'; // ✅ smooth animations
import LandingHero from '../landing/LandingHero';
import LandingCards from '../landing/LandingCards';
import LandingFeatures from '../landing/LandingFeatures';
import LandingFooter from '../landing/LandingFooter';
import LoadingScreen from '../LoadingScreen'; // ✅ fallback if something lags

const LandingPage = () => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col min-h-screen bg-white text-gray-800 overflow-hidden"
      >
        <LandingHero />
        <LandingCards />
        <LandingFeatures />
        <LandingFooter />
      </motion.div>
    </Suspense>
  );
};

export default LandingPage;
