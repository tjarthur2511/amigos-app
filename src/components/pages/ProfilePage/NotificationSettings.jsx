// src/components/pages/ProfilePage/NotificationSettings.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { auth, db } from '../../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNotification } from '../../../context/NotificationContext.jsx';
import Spinner from '../../common/Spinner';

// Define available preference keys and their labels
const PREFERENCE_OPTIONS = [
  { key: 'commentsOnMyPosts', label: 'Comments on your posts' },
  { key: 'reactionsToMyPosts', label: 'Reactions to your posts' },
  { key: 'newPostsInGrupos', label: 'New posts in your Grupos' },
  { key: 'amigoRequests', label: 'Amigo requests' },
  // Add more as backend logic supports them
  // { key: 'eventReminders', label: 'Event reminders' },
];

const NotificationSettings = () => {
  const { showNotification } = useNotification();
  const [preferences, setPreferences] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  const userId = auth.currentUser?.uid;

  const fetchPreferences = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const currentPrefs = userSnap.data().notificationPreferences || {};
        // Initialize with default true if not set
        const initialPrefs = {};
        PREFERENCE_OPTIONS.forEach(opt => {
          initialPrefs[opt.key] = currentPrefs[opt.key] !== undefined ? currentPrefs[opt.key] : true;
        });
        setPreferences(initialPrefs);
      } else {
        // User doc doesn't exist, initialize all to true
        const defaultPrefs = {};
        PREFERENCE_OPTIONS.forEach(opt => {
          defaultPrefs[opt.key] = true;
        });
        setPreferences(defaultPrefs);
      }
    } catch (error) {
      console.error("Error fetching notification preferences:", error);
      showNotification("Failed to load notification settings.", "error");
      // Initialize with default true on error too
      const defaultPrefsOnError = {};
      PREFERENCE_OPTIONS.forEach(opt => {
        defaultPrefsOnError[opt.key] = true;
      });
      setPreferences(defaultPrefsOnError);
    } finally {
      setIsLoading(false);
      setInitialLoadComplete(true);
    }
  }, [userId, showNotification]);

  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  const handleToggle = (key) => {
    if (!initialLoadComplete) return; // Prevent toggling before initial load
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSaveChanges = async () => {
    if (!userId) {
      showNotification("User not found. Please log in again.", "error");
      return;
    }
    setIsSaving(true);
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        notificationPreferences: preferences,
      });
      showNotification("Notification settings saved!", "success");
    } catch (error) {
      console.error("Error saving notification preferences:", error);
      showNotification("Failed to save settings. Please try again.", "error");
    } finally {
      setIsSaving(false);
    }
  };
  
  // Common Tailwind classes for toggle switch
  const toggleBaseClasses = "relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-coral";
  const toggleCheckedClasses = "bg-coral";
  const toggleUncheckedClasses = "bg-neutral-300";
  const toggleThumbBaseClasses = "inline-block w-4 h-4 transform bg-white rounded-full transition-transform";
  const toggleThumbCheckedClasses = "translate-x-6";
  const toggleThumbUncheckedClasses = "translate-x-1";


  if (isLoading && !initialLoadComplete) {
    return (
      <div className="flex justify-center items-center py-8">
        <Spinner size="md" color="coral" />
      </div>
    );
  }

  return (
    <div className="mt-8 p-6 bg-neutral-50 rounded-xl shadow">
      <h3 className="text-xl font-semibold text-charcoal mb-6">Notification Settings</h3>
      <div className="space-y-6">
        {PREFERENCE_OPTIONS.map(({ key, label }) => (
          <div key={key} className="flex items-center justify-between">
            <span className="text-neutral-700 text-sm">{label}</span>
            <button
              type="button"
              onClick={() => handleToggle(key)}
              className={`${toggleBaseClasses} ${preferences[key] ? toggleCheckedClasses : toggleUncheckedClasses}`}
              aria-pressed={preferences[key]}
              disabled={isSaving || !initialLoadComplete}
            >
              <span className="sr-only">Toggle {label}</span>
              <span
                className={`${toggleThumbBaseClasses} ${preferences[key] ? toggleThumbCheckedClasses : toggleThumbUncheckedClasses}`}
              />
            </button>
          </div>
        ))}
      </div>
      <div className="mt-8 text-right">
        <button
          onClick={handleSaveChanges}
          className="bg-coral text-white py-2.5 px-6 rounded-button font-comfortaa font-bold text-sm hover:bg-coral-dark active:bg-coral-dark/90 focus:outline-none focus:ring-2 focus:ring-coral-dark focus:ring-offset-2 disabled:opacity-70 flex items-center justify-center min-w-[120px]"
          disabled={isSaving || !initialLoadComplete}
        >
          {isSaving ? <Spinner size="sm" color="white" /> : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

export default NotificationSettings;
