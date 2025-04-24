import React, { useState, useEffect } from "react";
import { auth, db } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useTranslation } from "react-i18next";

const Settings = () => {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState("en");
  const [location, setLocation] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      const docRef = doc(db, "users", auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setLanguage(data.language || "en");
        setLocation(data.location || "");
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    const docRef = doc(db, "users", auth.currentUser.uid);
    await updateDoc(docRef, {
      language,
      location,
    });
    i18n.changeLanguage(language);
  };

  return (
    <div className="settings">
      <h2>{t("settings")}</h2>

      <label>{t("preferredLanguage") || "Preferred Language"}</label>
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
      >
        <option value="en">English</option>
        <option value="es">Español</option>
        {/* Add more languages here */}
      </select>

      <label>{t("preferredLocation") || "Preferred Location"}</label>
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="e.g. Detroit, MI"
      />

      <button onClick={handleSave}>{t("save")}</button>
    </div>
  );
};

export default Settings;
