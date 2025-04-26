import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingHero = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/signup');
  };

  return (
    <section className="flex flex-col items-center justify-center text-center bg-[#FF6B6B] text-white p-10 min-h-[60vh]">
      <h1 className="text-4xl md:text-6xl font-bold mb-4">
        Real Friends. Real Adventures.
      </h1>
      <p className="text-lg md:text-2xl max-w-2xl mb-8">
        Find your next Amigo today.  
        A community built for real friendships, not just followers.
      </p>
      <button
        onClick={handleGetStarted}
        className="px-8 py-3 bg-white text-[#FF6B6B] font-semibold rounded-2xl shadow-md hover:bg-gray-100 transition-all text-lg"
      >
        Find Amigos
      </button>
    </section>
  );
};

export default LandingHero;
