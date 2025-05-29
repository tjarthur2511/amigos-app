// src/components/common/Spinner.jsx
import React from 'react';

const Spinner = ({ size = 'md', color = 'coral' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const colorClasses = {
    coral: 'border-t-coral',
    white: 'border-t-white',
    neutral: 'border-t-neutral-500',
  };

  const spinnerColorClass = colorClasses[color] || colorClasses.coral;

  return (
    <div
      className={`animate-spin rounded-full border-4 border-transparent ${spinnerColorClass} ${sizeClasses[size] || sizeClasses.md}`}
      role="status"
      aria-live="polite"
      aria-label="Loading..."
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Spinner;
