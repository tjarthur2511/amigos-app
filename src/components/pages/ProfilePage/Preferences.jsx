// src/components/pages/ProfilePage/Preferences.jsx
import React, { useEffect, useState } from "react";
import { db, auth } from "../../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const Preferences = () => {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState("en");
  const [location, setLocation] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchPrefs = async () => {
      try {
        const docRef = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setLanguage(data.language || "en");
          setLocation(data.location || "");
          i18n.changeLanguage(data.language || "en");
        }
      } catch (error) {
        console.error("Error fetching preferences:", error);
      }
    };

    fetchPrefs();
  }, [i18n]);

  const savePrefs = async () => {
    try {
      const docRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(docRef, { language, location });
      i18n.changeLanguage(language);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Error saving preferences:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col items-center space-y-6 p-6 bg-white rounded-2xl shadow-lg font-[Comfortaa]"
    >
      <h2 className="text-3xl font-bold text-[#FF6B6B] lowercase">
        preferences
      </h2>

      <div className="w-full max-w-md space-y-6">
        <div>
          <label className="font-semibold lowercase text-gray-700">
            preferred language:
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 mt-2 focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
          >
            <option value="en">english</option>
            <option value="es">español</option>
          </select>
        </div>

        <div>
          <label className="font-semibold lowercase text-gray-700">
            preferred location:
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="city, state"
            className="w-full border border-gray-300 rounded-lg p-3 mt-2 focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
          />
        </div>

        <button
          onClick={savePrefs}
          className="w-full bg-[#FF6B6B] text-white py-3 rounded-lg font-semibold hover:bg-[#e15555] transition-all"
        >
          save preferences
        </button>

        {saved && (
          <p className="text-green-600 text-center font-semibold mt-4">
            preferences updated successfully!
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default Preferences;
