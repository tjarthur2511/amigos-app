import React, { useState } from "react";
import { db, auth } from "../../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import InlineNotification from "./InlineNotification"; // Import InlineNotification

const SupportModal = ({ onClose }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [message, setMessage] = useState("");
  const [notification, setNotification] = useState({ message: '', type: '' });

  const handleSubmit = async () => {
    setNotification({ message: '', type: '' }); // Clear previous notifications
    if (!selectedOption || !message.trim()) {
      setNotification({ message: "Please select an issue type and write a message.", type: "warning" });
      return;
    }

    try {
      const user = auth.currentUser;
      await addDoc(collection(db, "feedback"), {
        userId: user?.uid || "anonymous",
        type: selectedOption,
        message: message.trim(),
        createdAt: serverTimestamp(),
      });
      setNotification({ message: "Support request submitted. Thank you!", type: "success" });
      setSelectedOption("");
      setMessage("");
      setTimeout(() => {
        onClose();
        setNotification({ message: '', type: '' });
      }, 1500);
    } catch (err) {
      console.error("Error submitting support request:", err);
      setNotification({ message: "Failed to submit support request. Please try again.", type: "error" });
    }
  };

  // Define Tailwind classes
  const standardButtonBase = "rounded-full font-comfortaa font-bold shadow-md transition-all duration-200 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed";
  const primaryButtonClasses = `${standardButtonBase} bg-coral text-white hover:bg-coral-dark`;
  const secondaryButtonClasses = `${standardButtonBase} bg-blush text-coral border border-coral hover:bg-coral hover:text-white`; // For Cancel

  const modalContainerClasses = "fixed top-24 right-4 w-[340px] bg-white text-coral p-6 rounded-[1.5rem] shadow-[0_4px_20px_rgba(255,107,107,0.4)] font-comfortaa z-[100010] max-h-[80vh] overflow-y-auto flex flex-col gap-4";
  const titleClasses = "text-xl font-bold mb-0 text-center";
  const labelClasses = "font-bold text-base mb-1 block text-gray-700";
  const selectClasses = "w-full py-2 px-3 rounded-full border border-coral font-comfortaa focus:ring-2 focus:ring-coral focus:border-transparent";
  const textareaClasses = "w-full p-2.5 rounded-xl border border-coral font-comfortaa resize-y mt-1 focus:ring-2 focus:ring-coral focus:border-transparent";
  const submitButtonClasses = `${primaryButtonClasses} w-full py-2.5 mt-4 text-base`; // Added text-base
  const cancelButtonClasses = `${secondaryButtonClasses} w-full py-2.5 mt-2 text-base`; // Added text-base


  return (
    <div className={modalContainerClasses}>
      <h2 className={titleClasses}>
        Contact Support
      </h2>

      {notification.message && (
        <InlineNotification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ message: '', type: '' })}
        />
      )}
      
      <div>
        <label htmlFor="issue-type" className={labelClasses}>Type of Issue</label>
        <select
          id="issue-type"
          name="issueType"
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
          className={selectClasses}
        >
          <option value="">Select</option>
          <option value="bug">Bug Report</option>
          <option value="feedback">Feedback</option>
          <option value="account">Account Help</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="message-input" className={labelClasses}>Your Message</label>
        <textarea
          id="message-input"
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className={textareaClasses}
          placeholder="Describe your issue..."
        />
      </div>
      
      <div> {/* Wrapper for buttons to control spacing if needed */}
        <button onClick={handleSubmit} className={submitButtonClasses}>
          Submit
        </button>
        <button
          onClick={onClose}
          className={cancelButtonClasses}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

// Style object constants are no longer needed.

export default SupportModal;
