import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid'; // Using Heroicons for the close icon

const InlineNotification = ({ message, type = 'info', onClose }) => {
  const baseStyle = "p-4 rounded-md flex items-center justify-between shadow-md font-comfortaa"; // Added font-comfortaa for consistency
  
  // Updated to use the new feedback colors from tailwind.config.js
  const typeStyles = {
    error: "bg-feedback-error-bg text-feedback-error",
    success: "bg-feedback-success-bg text-feedback-success",
    warning: "bg-feedback-warning-bg text-feedback-warning",
    info: "bg-feedback-info-bg text-feedback-info",
  };

  if (!message) return null;

  return (
    <div className={`${baseStyle} ${typeStyles[type] || typeStyles.info}`}>
      <span>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          // Improved focus state and consistent icon color
          className="ml-4 p-1 rounded-md hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-current text-current"
          aria-label="Close notification"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default InlineNotification;
