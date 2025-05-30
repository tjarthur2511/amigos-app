// src/components/common/BackButton.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

const BackButton = ({ to, children, className = '' }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1); // Go back to the previous page in history
    }
  };

  // Base classes for styling, using Tailwind utilities and theme values
  // text-sm for smaller text, py-1.5 px-3 for padding, rounded-button for theme border radius
  // neutral colors for a secondary button appearance
  // Added focus states for accessibility
  const baseClasses = "inline-flex items-center space-x-2 border border-transparent text-sm font-medium rounded-button shadow-sm focus:outline-none";
  const themeClasses = "text-neutral-700 bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300 focus:ring-2 focus:ring-offset-2 focus:ring-coral disabled:opacity-50 disabled:cursor-not-allowed";
  const paddingClasses = "px-3 py-1.5 sm:px-4 sm:py-2"; // Responsive padding

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${baseClasses} ${themeClasses} ${paddingClasses} ${className}`}
    >
      <ArrowLeftIcon className="h-5 w-5" aria-hidden="true" />
      <span>{children || 'Back'}</span>
    </button>
  );
};

export default BackButton;