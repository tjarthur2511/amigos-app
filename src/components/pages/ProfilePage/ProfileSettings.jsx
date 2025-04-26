import React, { useState, useEffect } from "react";
import { auth, db } from "../../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useTranslation } from "react-i18next";

const ProfileSettings = () => {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState("en");
  const [location, setLocation] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchUserSettings = async () => {
      const docRef = doc(db, "users", auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setLanguage(data.language || "en");
        setLocation(data.location || "");
        i18n.changeLanguage(data.language || "en");
      }
    };

    fetchUserSettings();
  }, [i18n]);

  const handleSave = async () => {
    try {
      const docRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(docRef, {
        language,
        location,
      });
      i18n.changeLanguage(language);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000); // Hide after 3 seconds
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      <h2 className="text-2xl font-bold text-[#FF6B6B]">{t("settings")}</h2>

      <div className="w-full max-w-md space-y-4">
        <div>
          <label className="font-semibold">{t("preferredLanguage")}:</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 mt-1"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            {/* Add more languages here */}
          </select>
        </div>

        <div>
          <label className="font-semibold">{t("preferredLocation")}:</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter your city or region"
            className="w-full border border-gray-300 rounded-lg p-2 mt-1"
          />
        </div>

        <button
          onClick={handleSave}
          className="mt-4 bg-[#FF6B6B] text-white py-2 px-4 rounded-lg font-semibold hover:bg-[#ff8585] transition-all"
        >
          {t("save") || "Save Settings"}
        </button>

        {saved && (
          <p className="text-green-600 text-center mt-2">
            {t("settingsSaved") || "Settings updated successfully!"}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProfileSettings;
