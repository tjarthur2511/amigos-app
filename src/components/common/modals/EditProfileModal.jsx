import React, { useState, useEffect } from "react";
import { auth, db } from "../../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import InlineNotification from "./InlineNotification"; // Import InlineNotification

const EditProfileModal = ({ onClose }) => {
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [notification, setNotification] = useState({ message: '', type: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        setDisplayName(data.displayName || "");
        setBio(data.bio || "");
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) {
      setNotification({ message: "User not found. Please log in again.", type: "error" });
      return;
    }
    setNotification({ message: '', type: '' }); // Clear previous notifications

    try {
      await updateDoc(doc(db, "users", user.uid), {
        displayName,
        bio,
      });
      setNotification({ message: "Profile updated successfully.", type: "success" });
      setTimeout(() => {
        onClose();
        setNotification({ message: '', type: '' }); // Clear notification on close
      }, 1500); // Auto-close after 1.5s
    } catch (err) {
      console.error("Error updating profile:", err);
      setNotification({ message: "Failed to update profile. Please try again.", type: "error" });
    }
  };

  // Define Tailwind classes
  const modalContainerClasses = "fixed top-24 right-4 w-96 bg-white text-coral p-6 rounded-[1.5rem] shadow-[0_4px_20px_rgba(255,107,107,0.4)] font-comfortaa z-[100010] max-h-[80vh] overflow-y-auto flex flex-col gap-4";
  const titleClasses = "text-2xl mb-0 font-bold text-center"; // Adjusted mb from 1rem to 0, gap handles spacing
  const labelClasses = "text-sm font-bold mb-1 block text-gray-700"; // Adjusted color and size
  const inputClasses = "w-full py-2 px-4 rounded-full border border-gray-300 font-comfortaa focus:ring-2 focus:ring-coral focus:border-transparent";
  const textareaClasses = `${inputClasses} rounded-xl resize-none h-20`; // Specific for textarea
  const saveButtonClasses = "mt-2 bg-coral text-white py-2.5 px-4 w-full border-none rounded-full font-bold text-base cursor-pointer hover:bg-coral-dark transition-colors";
  const cancelButtonClasses = "mt-2 bg-blush text-coral py-2 px-4 rounded-full border border-coral font-comfortaa cursor-pointer w-full hover:bg-coral-dark hover:text-white transition-colors";


  return (
    <div className={modalContainerClasses}>
      <h2 className={titleClasses}>
        Edit Profile
      </h2>
      
      {notification.message && (
        <InlineNotification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ message: '', type: '' })}
        />
      )}

      <div>
        <label htmlFor="displayName" className={labelClasses}>Display Name</label>
        <input
          type="text"
          id="displayName"
          name="displayName"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Enter your name"
          className={inputClasses}
        />
      </div>

      <div>
        <label htmlFor="bio" className={labelClasses}>Bio</label>
        <textarea
          id="bio"
          name="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell us about yourself"
          className={textareaClasses}
        />
      </div>

      <button onClick={handleSave} className={saveButtonClasses}>
        Save Changes
      </button>

      <button
        onClick={onClose}
        className={cancelButtonClasses}
      >
        Cancel
      </button>
    </div>
  );
};

// Style object constants are no longer needed.

export default EditProfileModal;
