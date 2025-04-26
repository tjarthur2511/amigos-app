import React from 'react';

const LandingFooter = () => {
  return (
    <footer className="w-full bg-white text-gray-500 text-sm text-center py-6 mt-12 border-t">
      <p>
        © {new Date().getFullYear()} Amigos. All rights reserved.
      </p>
      <div className="flex justify-center space-x-6 mt-4">
        <a href="#" className="hover:text-[#FF6B6B] transition-all">
          About
        </a>
        <a href="#" className="hover:text-[#FF6B6B] transition-all">
          Privacy Policy
        </a>
        <a href="#" className="hover:text-[#FF6B6B] transition-all">
          Terms
        </a>
      </div>
    </footer>
  );
};

export default LandingFooter;
