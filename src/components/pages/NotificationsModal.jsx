 // src/components/pages/NotificationModal.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const NotificationModal = ({ isOpen, onClose, notifications }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50`}
    >
      <div
        className="bg-white rounded-lg p-6 w-80"
        style={{ maxHeight: '80vh', overflowY: 'auto' }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Notifications</h2>
          <button
            onClick={onClose}
            className="text-xl text-gray-600 hover:text-gray-900"
          >
            ✖
          </button>
        </div>
        <div>
          {notifications && notifications.length > 0 ? (
            <ul>
              {notifications.map((notification, index) => (
                <li key={index} className="border-b py-2">
                  <p className="text-gray-800">{notification.message}</p>
                  <p className="text-sm text-gray-500">{notification.timestamp}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No notifications yet.</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default NotificationModal;
