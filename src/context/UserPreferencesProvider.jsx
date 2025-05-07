// src/context/UserPreferencesProvider.jsx
import React, { useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "./AuthContext";
import { db } from "../firebase";
import { useTranslation } from "react-i18next";

const UserPreferencesProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const { i18n } = useTranslation();

  useEffect(() => {
    const applyPreferences = async () => {
      if (!currentUser) return;

      const userRef = doc(db, "users", currentUser.uid);
      const snap = await getDoc(userRef);
      if (!snap.exists()) return;

      const data = snap.data();

      if (data.theme?.primary) {
        document.documentElement.style.setProperty("--theme-color", data.theme.primary);
      }
      if (data.theme?.text) {
        document.documentElement.style.setProperty("--text-color", data.theme.text);
      }
      if (data.theme?.hover) {
        document.documentElement.style.setProperty("--hover-color", data.theme.hover);
      }

      if (data.language) {
        i18n.changeLanguage(data.language);
      }
    };

    applyPreferences();
  }, [currentUser]);

  return children;
};

export default UserPreferencesProvider;
