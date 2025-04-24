import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useTranslation } from "react-i18next";

const Preferences = () => {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState("en");
  const [location, setLocation] = useState("");

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
    const docRef = doc(db, "users", auth.currentUser.uid);
    await updateDoc(docRef, { language, location });
    i18n.changeLanguage(language);
    alert("Preferences saved!");
  };

  return (
    <div className="preferences">
      <h2>Preferences</h2>
      <label>Language:</label>
      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="en">English</option>
        <option value="es">Español</option>
        {/* Add more languages as needed */}
      </select>
      <label>Location:</label>
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="City, State"
      />
      <button onClick={savePrefs}>Save Preferences</button>
    </div>
  );
};

export default Preferences;
