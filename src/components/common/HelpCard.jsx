import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import ThemePanel from "./ThemePanel";
import ChangePasswordModal from "./modals/ChangePasswordModal";
import EditProfileModal from "./modals/EditProfileModal";
import SupportModal from "./modals/SupportModal";

const HelpCard = ({ onClose }) => {
  const { i18n } = useTranslation();
  const [accessibility, setAccessibility] = useState(false);
  const [fontSize, setFontSize] = useState("1");
  const [pushAlerts, setPushAlerts] = useState(false);
  const [weeklySuggestions, setWeeklySuggestions] = useState(false);
  const [quizReminder, setQuizReminder] = useState(false);
  const [locationAllowed, setLocationAllowed] = useState(false);
  const [showThemePanel, setShowThemePanel] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);

  const user = auth.currentUser;

  useEffect(() => {
    const fetchPreferences = async () => {
      if (!user) return;
      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);
      const prefs = snap.data()?.preferences || {};
      setFontSize(prefs.fontSize || "1");
      setAccessibility(prefs.accessibility || false);
      setPushAlerts(prefs.pushAlerts || false);
      setWeeklySuggestions(prefs.weeklySuggestions || false);
      setQuizReminder(prefs.quizReminder || false);
      setLocationAllowed(prefs.locationAllowed || false);
    };
    fetchPreferences();
  }, [user]);

  const savePreferences = async (field, value) => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      [`preferences.${field}`]: value,
    });
  };

  const handleLanguageChange = (e) => {
    const lng = e.target.value;
    i18n.changeLanguage(lng);
    document.documentElement.lang = lng;
    savePreferences("language", lng);
  };

  const handleFontSizeChange = (e) => {
    const scale = e.target.value;
    setFontSize(scale);
    document.documentElement.style.setProperty("--text-scale", scale);
    savePreferences("fontSize", scale);
  };

  const fontSizes = [
    { label: "Small", scale: "0.875" },
    { label: "Normal", scale: "1" },
    { label: "Large", scale: "1.25" },
    { label: "Extra Large", scale: "1.5" },
  ];

  // Define Tailwind classes
  const standardButtonBase = "rounded-full font-comfortaa font-bold shadow-md transition-all duration-200 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed";
  const primaryButtonClasses = `${standardButtonBase} bg-coral text-white hover:bg-coral-dark`;
  // Secondary buttons in HelpCard were originally blush bg with coral text and border.
  // To align with the "single primary style" directive as much as possible while providing some distinction,
  // we'll use the primary style but perhaps with adjusted padding/text size if contextually appropriate.
  // For this pass, all buttons will get the primary style.
  const helpCardButtonClasses = `${primaryButtonClasses} py-2 px-4 text-sm w-full block mt-2`; // text-sm and specific padding for help card buttons

  const modalContainerClasses = "fixed bottom-6 right-[26rem] w-96 bg-white text-coral p-6 rounded-[1.5rem] shadow-[0_4px_20px_rgba(255,107,107,0.4)] font-comfortaa z-[100010] max-h-[80vh] overflow-y-auto flex flex-col gap-6";
  const titleClasses = "text-2xl font-bold text-center";
  const sectionClasses = "space-y-2";
  const labelClasses = "text-lg font-bold text-coral";
  const inputBaseClasses = "w-full py-2 px-4 rounded-full border font-comfortaa focus:ring-2 focus:ring-coral focus:border-transparent";
  const selectInputClasses = `${inputBaseClasses} border-coral text-coral`;
  const checkboxLabelClasses = "flex items-center text-sm text-gray-700";
  const checkboxClasses = "mr-2 h-4 w-4 text-coral focus:ring-coral border-gray-300 rounded";


  return (
    <>
      <div className={modalContainerClasses}>
        <h2 className={titleClasses}>
          Amigos Dashboard
        </h2>

        {/* Language */}
        <div className={sectionClasses}>
          <label htmlFor="language-select" className={labelClasses}>Language</label>
          <p className="text-sm text-gray-600">Change your preferred language.</p>
          <select
            id="language-select"
            name="language"
            defaultValue={i18n.language}
            onChange={handleLanguageChange}
            className={selectInputClasses}
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
            <option value="pt">Português</option>
            <option value="ja">日本語</option>
            <option value="ko">한국어</option>
            <option value="it">Italiano</option>
            <option value="hi">Hindi</option>
            <option value="ar">Arabic</option>
            <option value="ru">Russian</option>
            <option value="zh">Chinese</option>
          </select>
        </div>

        {/* Theme */}
        <div className={sectionClasses}>
          <h3 className={labelClasses}>Theme</h3>
          <p className="text-sm text-gray-600">Open the full theme settings panel.</p>
          <button className={helpCardButtonClasses} onClick={() => setShowThemePanel(true)}>
            Customize Theme
          </button>
        </div>

        {/* Accessibility */}
        <div className={sectionClasses}>
          <h3 className={labelClasses}>Accessibility</h3>
          <p className="text-sm text-gray-600">Enable font scaling and high contrast options.</p>
          <button
            className={helpCardButtonClasses}
            onClick={() => {
              setAccessibility(!accessibility);
              savePreferences("accessibility", !accessibility);
            }}
          >
            {accessibility ? "Disable" : "Enable"} Accessibility Mode
          </button>

          {accessibility && (
            <div className="mt-4">
              <label htmlFor="font-size-select" className="block mb-2 text-sm font-medium text-gray-700">Font Size</label>
              <select
                id="font-size-select"
                name="fontSize"
                value={fontSize}
                onChange={handleFontSizeChange}
                className={selectInputClasses}
              >
                {fontSizes.map((f) => (
                  <option key={f.label} value={f.scale}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className={sectionClasses}>
          <h3 className={labelClasses}>Notifications</h3>
          <label htmlFor="push-alerts" className={checkboxLabelClasses}>
            <input
              id="push-alerts"
              name="pushAlerts"
              type="checkbox"
              checked={pushAlerts}
              onChange={() => {
                setPushAlerts(!pushAlerts);
                savePreferences("pushAlerts", !pushAlerts);
              }}
              className={checkboxClasses}
            />
            Enable push alerts
          </label>
          
          <label htmlFor="weekly-suggestions" className={checkboxLabelClasses}>
            <input
              id="weekly-suggestions"
              name="weeklySuggestions"
              type="checkbox"
              checked={weeklySuggestions}
              onChange={() => {
                setWeeklySuggestions(!weeklySuggestions);
                savePreferences("weeklySuggestions", !weeklySuggestions);
              }}
              className={checkboxClasses}
            />
            Weekly suggestions
          </label>
          
          <label htmlFor="quiz-reminder" className={checkboxLabelClasses}>
            <input
              id="quiz-reminder"
              name="quizReminder"
              type="checkbox"
              checked={quizReminder}
              onChange={() => {
                setQuizReminder(!quizReminder);
                savePreferences("quizReminder", !quizReminder);
              }}
              className={checkboxClasses}
            />
            Monthly quiz reminder
          </label>
        </div>

        {/* Location Access */}
        <div className={sectionClasses}>
          <h3 className={labelClasses}>Location Access</h3>
          <label htmlFor="location-access" className={checkboxLabelClasses}>
            <input
              id="location-access"
              name="locationAllowed"
              type="checkbox"
              checked={locationAllowed}
              onChange={() => {
                setLocationAllowed(!locationAllowed);
                savePreferences("locationAllowed", !locationAllowed);
              }}
              className={checkboxClasses}
            />
            Allow location access for local events and suggestions
          </label>
        </div>

        {/* Account Info */}
        <div className={sectionClasses}>
          <h3 className={labelClasses}>Account Info</h3>
          <button className={helpCardButtonClasses} onClick={() => setShowEditProfile(true)}>
            Edit Profile
          </button>
          <button className={helpCardButtonClasses} onClick={() => setShowChangePassword(true)}>
            Change Password
          </button>
        </div>

        {/* Support */}
        <div className={sectionClasses}>
          <h3 className={labelClasses}>Support</h3>
          <button className={helpCardButtonClasses} onClick={() => setShowSupportModal(true)}>
            Open Support Form
          </button>
        </div>

        <button
          onClick={onClose}
          className={`${helpCardButtonClasses} bg-coral-dark hover:bg-coral`} // Close button slightly darker for distinction
        >
          Close
        </button>
      </div>

      {/* Modals */}
      {showThemePanel && <ThemePanel onClose={() => setShowThemePanel(false)} />}
      {showChangePassword && (
        <ChangePasswordModal onClose={() => setShowChangePassword(false)} />
      )}
      {showEditProfile && (
        <EditProfileModal onClose={() => setShowEditProfile(false)} />
      )}
      {showSupportModal && <SupportModal onClose={() => setShowSupportModal(false)} />}
    </>
  );
};

// Style object constants are no longer needed.

export default HelpCard;
