import React, { useState } from "react";
import InlineNotification from "./InlineNotification"; // Import InlineNotification

const ChangePasswordModal = ({ onClose }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [notification, setNotification] = useState({ message: '', type: '' });

  const handleSave = async () => {
    setNotification({ message: '', type: '' }); // Clear previous notifications
    if (newPassword !== confirmPassword) {
      setNotification({ message: "New passwords do not match.", type: "error" });
      return;
    }
    if (!currentPassword || !newPassword) {
      setNotification({ message: "All password fields are required.", type: "warning" });
      return;
    }
    if (newPassword.length < 6) { // Basic length check
        setNotification({ message: "New password must be at least 6 characters.", type: "warning" });
        return;
    }


    // 🔧 Hook up real password change logic with Firebase later
    // For now, simulate success and close with notification
    console.log("Password change submitted", { currentPassword, newPassword });
    setNotification({ message: "Password change functionality not yet implemented.", type: "info" });
    // setTimeout(() => { 
    //   onClose();
    //   setNotification({ message: '', type: '' }); 
    // }, 2000);
  };

  // Define Tailwind classes
  const standardButtonBase = "rounded-full font-comfortaa font-bold shadow-md transition-all duration-200 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed";
  const primaryButtonClasses = `${standardButtonBase} bg-coral text-white hover:bg-coral-dark`;
  const secondaryButtonClasses = `${standardButtonBase} bg-blush text-coral border border-coral hover:bg-coral hover:text-white`; // For Cancel

  const modalContainerClasses = "fixed top-24 right-4 w-96 bg-white text-coral p-6 rounded-[1.5rem] shadow-[0_4px_20px_rgba(255,107,107,0.4)] font-comfortaa z-[100010] max-h-[80vh] overflow-y-auto flex flex-col gap-4";
  const titleClasses = "text-2xl mb-0 font-bold text-center";
  const labelClasses = "text-sm font-bold mb-1 block text-gray-700";
  const inputClasses = "w-full py-2 px-4 rounded-full border border-gray-300 font-comfortaa focus:ring-2 focus:ring-coral focus:border-transparent";
  const saveButtonClasses = `${primaryButtonClasses} mt-2 py-2.5 px-4 w-full text-base`;
  const cancelButtonClasses = `${secondaryButtonClasses} mt-2 py-2 px-4 w-full text-base`;

  return (
    <div className={modalContainerClasses}>
      <h2 className={titleClasses}>
        Change Password
      </h2>

      {notification.message && (
        <InlineNotification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ message: '', type: '' })}
        />
      )}

      <div>
        <label htmlFor="current-password" className={labelClasses}>Current Password</label>
        <input
          id="current-password"
          name="currentPassword"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className={inputClasses}
        />
      </div>

      <div>
        <label htmlFor="new-password" className={labelClasses}>New Password</label>
        <input
          id="new-password"
          name="newPassword"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className={inputClasses}
        />
      </div>

      <div>
        <label htmlFor="confirm-password" className={labelClasses}>Confirm New Password</label>
        <input
          id="confirm-password"
          name="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={inputClasses}
        />
      </div>

      <button onClick={handleSave} className={saveButtonClasses}>
        Save New Password
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

export default ChangePasswordModal;
