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
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50, // Ensure it's above other content
            fontFamily: "'Comfortaa', sans-serif",
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '1rem',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              width: '90%',
              maxWidth: '400px',
              textAlign: 'center',
            }}
          >
            <h2 style={{ fontSize: '1.5rem', color: '#333', marginBottom: '1rem', fontWeight: 'bold' }}>
              {title}
            </h2>
            <p style={{ fontSize: '1rem', color: '#555', marginBottom: '2rem' }}>
              {message}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-around', gap: '1rem' }}>
              <button
                onClick={onCancel}
                style={{
                  backgroundColor: '#6c757d', // A neutral gray
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '20px',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease',
                  flex: 1,
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#5a6268'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#6c757d'}
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                style={{
                  backgroundColor: '#FF6B6B', // Theme color for confirm
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '20px',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease',
                  flex: 1,
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#e15555'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#FF6B6B'}
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
