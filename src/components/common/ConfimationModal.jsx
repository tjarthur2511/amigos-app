import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ConfirmationModal = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          // Backdrop styles replaced with Tailwind classes
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 font-comfortaa p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            // Modal container styles replaced with Tailwind classes
            // Using theme values: bg-neutral-50 (very light gray), rounded-xl, shadow-lg
            // padding from theme: modal-p (defaulting to p-8 if not specifically set, or using p-8 directly)
            className="bg-neutral-50 p-6 sm:p-8 rounded-xl shadow-xl w-full max-w-md text-center"
          >
            <h2 
              // Title styles replaced with Tailwind classes
              // Using theme colors: text-neutral-800 or text-charcoal
              className="text-2xl font-bold text-neutral-800 mb-4"
            >
              {title}
            </h2>
            <p 
              // Message styles replaced with Tailwind classes
              // Using theme colors: text-neutral-600
              className="text-base text-neutral-600 mb-8"
            >
              {message}
            </p>
            <div 
              // Button container styles replaced with Tailwind classes
              className="flex justify-between items-center gap-4"
            >
              <button
                onClick={onCancel}
                // Cancel button styles replaced with Tailwind classes
                // Using theme values: bg-neutral-500, text-white, hover:bg-neutral-600, rounded-button
                className="flex-1 py-2.5 px-5 bg-neutral-300 text-neutral-700 rounded-button font-semibold hover:bg-neutral-400 transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-opacity-50"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                // Confirm button styles replaced with Tailwind classes
                // Using theme values: bg-coral, text-white, hover:bg-coral-dark, rounded-button
                className="flex-1 py-2.5 px-5 bg-coral text-white rounded-button font-semibold hover:bg-coral-dark transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-coral-dark focus:ring-opacity-50"
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationModal;