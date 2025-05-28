import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid'; // Using Heroicons for the close icon

const InlineNotification = ({ message, type = 'info', onClose }) => {
  const baseStyle = "p-4 rounded-md flex items-center justify-between shadow-md";
  const typeStyles = {
    error: "bg-red-100 text-red-700",
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-700",
    info: "bg-blue-100 text-blue-700",
  };

  if (!message) return null;

  return (
    <div className={`${baseStyle} ${typeStyles[type] || typeStyles.info}`}>
      <span>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-4 p-1 rounded-md hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-current"
          aria-label="Close notification"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default InlineNotification;
