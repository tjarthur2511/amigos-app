import React, { createContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export const ThemeContext = createContext();

export const UserPreferencesProvider = ({ children }) => {
  const [theme, setTheme] = useState("coral"); // unused but kept for future toggling
  const [isThemeLoaded, setIsThemeLoaded] = useState(false);

  useEffect(() => {
    const applyThemeVars = ({ themeColor, textColor, hoverColor }) => {
      document.documentElement.style.setProperty("--theme-color", themeColor || "#FF6B6B");
      document.documentElement.style.setProperty("--text-color", textColor || "#FFFFFF");
      document.documentElement.style.setProperty("--hover-color", hoverColor || "#FFA3A3");
    };

    const loadTheme = async () => {
      const user = auth.currentUser;
      if (!user) {
        applyThemeVars({});
        return setIsThemeLoaded(true);
      }

      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const theme = snap.data()?.theme || {};
        applyThemeVars(theme);
      } else {
        applyThemeVars({});
      }

      setIsThemeLoaded(true);
    };

    loadTheme();
  }, []);

  return (
    <ThemeContext.Provider value={{ theme }}>
      {isThemeLoaded ? children : null}
    </ThemeContext.Provider>
  );
};
