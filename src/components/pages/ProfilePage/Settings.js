// src/components/pages/ProfilePage/Settings.jsx
import React, { useState, useEffect } from "react";
import { auth, db } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion"; // ✅ smooth entrance animations

const Settings = () => {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState("en");
  const [location, setLocation] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setLanguage(data.language || "en");
          setLocation(data.location || "");
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    try {
      const docRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(docRef, { language, location });
      i18n.changeLanguage(language);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col items-center space-y-6 p-6 bg-gray-50 rounded-2xl shadow-lg"
    >
      <h2 className="text-2xl font-bold text-[#FF6B6B]">{t("settings") || "Settings"}</h2>

      <div className="w-full max-w-md space-y-6">
        <div>
          <label className="font-semibold text-gray-700">{t("preferredLanguage") || "Preferred Language"}:</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 mt-2 focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            {/* Add more languages if needed */}
          </select>
        </div>

        <div>
          <label className="font-semibold text-gray-700">{t("preferredLocation") || "Preferred Location"}:</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder={t("enterLocation") || "e.g. Detroit, MI"}
            className="w-full border border-gray-300 rounded-lg p-2 mt-2 focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
          />
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-[#FF6B6B] text-white py-3 rounded-lg font-semibold hover:bg-[#ff8585] transition-all"
        >
          {t("save") || "Save Settings"}
        </button>

        {saved && (
          <p className="text-green-600 text-center font-semibold mt-4">
            {t("settingsSaved") || "Settings updated successfully!"}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default Settings;
