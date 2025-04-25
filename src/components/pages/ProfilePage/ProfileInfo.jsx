import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useTranslation } from "react-i18next";

const ProfileInfo = () => {
  const { t } = useTranslation();
  const [userData, setUserData] = useState({});
  
  useEffect(() => {
    const fetchUser = async () => {
      const docRef = doc(db, "users", auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="profile-info">
      <h2>{t("yourProfile")}</h2>
      <img
        src={userData.photoURL || "https://via.placeholder.com/150"}
        alt="Profile"
        style={{ width: "150px", borderRadius: "50%" }}
      />
      <p><strong>{t("yourName")}:</strong> {userData.displayName || "Anonymous"}</p>
      <p><strong>{t("shortBio")}:</strong> {userData.bio || "No bio added."}</p>
      <p><strong>{t("preferredLanguage")}:</strong> {userData.language || "en"}</p>
      <p><strong>{t("preferredLocation")}:</strong> {userData.location || "N/A"}</p>
    </div>
  );
};

export default ProfileInfo;
