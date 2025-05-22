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

  return (
    <>
      <div
        style={{
          position: "fixed",
          bottom: "1.5rem",
          right: "26rem",
          width: "360px",
          backgroundColor: "#fff",
          color: "#FF6B6B",
          padding: "1.5rem",
          borderRadius: "1.5rem",
          boxShadow: "0 4px 20px rgba(255, 107, 107, 0.4)",
          fontFamily: "Comfortaa, sans-serif",
          zIndex: 1000010,
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        <h2 style={{ fontSize: "1.6rem", marginBottom: "1rem", fontWeight: "bold" }}>
          Amigos Dashboard
        </h2>

        {/* Language */}
        <div style={sectionStyle}>
          <label htmlFor="language-select" style={labelStyle}>Language</label>
          <p>Change your preferred language.</p>
          <select
            id="language-select"
            name="language"
            defaultValue={i18n.language}
            onChange={handleLanguageChange}
            style={inputStyle}
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
        <div style={sectionStyle}>
          <h3 style={labelStyle}>Theme</h3>
          <p>Open the full theme settings panel.</p>
          <button style={buttonStyle} onClick={() => setShowThemePanel(true)}>
            Customize Theme
          </button>
        </div>

        {/* Accessibility */}
        <div style={sectionStyle}>
          <h3 style={labelStyle}>Accessibility</h3>
          <p>Enable font scaling and high contrast options.</p>
          <button
            style={buttonStyle}
            onClick={() => {
              setAccessibility(!accessibility);
              savePreferences("accessibility", !accessibility);
            }}
          >
            {accessibility ? "Disable" : "Enable"} Accessibility Mode
          </button>

          {accessibility && (
            <div style={{ marginTop: "1rem" }}>
              <label htmlFor="font-size-select" style={{ display: "block", marginBottom: "0.5rem" }}>Font Size</label>
              <select
                id="font-size-select"
                name="fontSize"
                value={fontSize}
                onChange={handleFontSizeChange}
                style={inputStyle}
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
        <div style={sectionStyle}>
          <h3 style={labelStyle}>Notifications</h3>
          <label htmlFor="push-alerts">
            <input
              id="push-alerts"
              name="pushAlerts"
              type="checkbox"
              checked={pushAlerts}
              onChange={() => {
                setPushAlerts(!pushAlerts);
                savePreferences("pushAlerts", !pushAlerts);
              }}
              style={{ marginRight: "0.5rem" }}
            />
            Enable push alerts
          </label>
          <br />
          <label htmlFor="weekly-suggestions">
            <input
              id="weekly-suggestions"
              name="weeklySuggestions"
              type="checkbox"
              checked={weeklySuggestions}
              onChange={() => {
                setWeeklySuggestions(!weeklySuggestions);
                savePreferences("weeklySuggestions", !weeklySuggestions);
              }}
              style={{ marginRight: "0.5rem" }}
            />
            Weekly suggestions
          </label>
          <br />
          <label htmlFor="quiz-reminder">
            <input
              id="quiz-reminder"
              name="quizReminder"
              type="checkbox"
              checked={quizReminder}
              onChange={() => {
                setQuizReminder(!quizReminder);
                savePreferences("quizReminder", !quizReminder);
              }}
              style={{ marginRight: "0.5rem" }}
            />
            Monthly quiz reminder
          </label>
        </div>

        {/* Location Access */}
        <div style={sectionStyle}>
          <h3 style={labelStyle}>Location Access</h3>
          <label htmlFor="location-access">
            <input
              id="location-access"
              name="locationAllowed"
              type="checkbox"
              checked={locationAllowed}
              onChange={() => {
                setLocationAllowed(!locationAllowed);
                savePreferences("locationAllowed", !locationAllowed);
              }}
              style={{ marginRight: "0.5rem" }}
            />
            Allow location access for local events and suggestions
          </label>
        </div>

        {/* Account Info */}
        <div style={sectionStyle}>
          <h3 style={labelStyle}>Account Info</h3>
          <button style={buttonStyle} onClick={() => setShowEditProfile(true)}>
            Edit Profile
          </button>
          <button style={buttonStyle} onClick={() => setShowChangePassword(true)}>
            Change Password
          </button>
        </div>

        {/* Support */}
        <div style={sectionStyle}>
          <h3 style={labelStyle}>Support</h3>
          <button style={buttonStyle} onClick={() => setShowSupportModal(true)}>
            Open Support Form
          </button>
        </div>

        <button
          onClick={onClose}
          style={{
            marginTop: "1rem",
            backgroundColor: "#FF6B6B",
            color: "#fff",
            padding: "0.5rem 1rem",
            borderRadius: "9999px",
            border: "none",
            fontWeight: "bold",
            cursor: "pointer",
            width: "100%",
          }}
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

// Styles
const sectionStyle = {
  marginBottom: "1.5rem",
};

const labelStyle = {
  fontSize: "1.1rem",
  fontWeight: "bold",
  marginBottom: "0.5rem",
};

const inputStyle = {
  padding: "0.5rem",
  borderRadius: "9999px",
  border: "1px solid #FF6B6B",
  marginTop: "0.5rem",
  width: "100%",
  fontFamily: "Comfortaa, sans-serif",
};

const buttonStyle = {
  display: "block",
  width: "100%",
  marginTop: "0.5rem",
  padding: "0.4rem 0.8rem",
  borderRadius: "9999px",
  backgroundColor: "#fff0f0",
  color: "#FF6B6B",
  border: "1px solid #FF6B6B",
  fontFamily: "Comfortaa, sans-serif",
  cursor: "pointer",
};

export default HelpCard;
