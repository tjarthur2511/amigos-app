import React from 'react';
import LandingHero from '../landing/LandingHero';
import LandingCards from '../landing/LandingCards';
import LandingFeatures from '../landing/LandingFeatures';
import LandingFooter from '../landing/LandingFooter';

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800">
      <LandingHero />
      <LandingCards />
      <LandingFeatures />
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
