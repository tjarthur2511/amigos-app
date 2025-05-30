import React, { createContext, useState, useCallback, useContext } from 'react';
import InlineNotification from '../components/common/modals/InlineNotification';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null); // { message, type, id }

  const showNotification = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now(); // Simple ID generator
    setNotification({ message, type, id });
    if (duration) {
      setTimeout(() => {
        // Only clear if this specific notification is still active
        setNotification(prev => (prev && prev.id === id ? null : prev));
      }, duration);
    }
  }, []);

  const closeNotification = useCallback(() => {
    setNotification(null);
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification, closeNotification }}>
      {children}
      {notification && (
        // This div will position the notification globally
        // Ensure z-index is high enough to be on top of other content
        // Tailwind classes for positioning:
        // fixed top-5 right-5 (top-right)
        // fixed top-5 left-1/2 -translate-x-1/2 (top-center)
        // fixed bottom-5 left-1/2 -translate-x-1/2 (bottom-center)
        // fixed bottom-5 right-5 (bottom-right)
        // Choose one based on desired placement. Top-right is common.
        <div className="fixed top-5 right-5 z-[9999] w-auto max-w-md"> 
          <InlineNotification
            message={notification.message}
            type={notification.type}
            onClose={closeNotification} // Allow manual closing
          />
        </div>
      )}
    </NotificationContext.Provider>
  );
};