import React, { useEffect, useState } from "react";
import { db, auth } from "../../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useTranslation } from "react-i18next";

const Preferences = () => {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState("en");
  const [location, setLocation] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchPrefs = async () => {
      const docRef = doc(db, "users", auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setLanguage(data.language || "en");
        setLocation(data.location || "");
        i18n.changeLanguage(data.language || "en");
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
      setTimeout(() => setSaved(false), 3000); // Hide saved message after 3s
    } catch (error) {
      console.error("Error saving preferences:", error);
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      <h2 className="text-2xl font-bold text-[#FF6B6B]">Preferences</h2>

      <div className="w-full max-w-md space-y-4">
        <div>
          <label className="font-semibold">Language:</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 mt-1"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            {/* You can add more languages here easily */}
          </select>
        </div>

        <div>
          <label className="font-semibold">Location:</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City, State"
            className="w-full border border-gray-300 rounded-lg p-2 mt-1"
          />
        </div>

        <button
          onClick={savePrefs}
          className="mt-4 bg-[#FF6B6B] text-white py-2 px-4 rounded-lg font-semibold hover:bg-[#ff8585] transition-all"
        >
          Save Preferences
        </button>

        {saved && (
          <p className="text-green-600 text-center mt-2">
            Preferences updated successfully!
          </p>
        )}
      </div>
    </div>
  );
};

export default Preferences;
