import React, { useState, useEffect } from "react";
import { auth, db } from "../../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useTranslation } from "react-i18next";

const ProfileSettings = () => {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState("en");
  const [location, setLocation] = useState("");

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
    const docRef = doc(db, "users", auth.currentUser.uid);
    await updateDoc(docRef, {
      language,
      location,
    });
    i18n.changeLanguage(language);
    alert("Settings saved!");
  };

  return (
    <div>
      <h2>{t("settings")}</h2>
      <label>{t("preferredLanguage")}:</label>
      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="en">English</option>
        <option value="es">Español</option>
      </select>

      <br /><br />

      <label>{t("preferredLocation")}:</label>
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Enter your city or region"
      />

      <br /><br />
      <button onClick={handleSave}>{t("save")}</button>
    </div>
  );
};

export default ProfileSettings;
