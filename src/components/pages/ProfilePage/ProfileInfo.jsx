// src/components/pages/ProfilePage/ProfileInfo.jsx
import React, { useEffect, useState } from "react";
import { auth, db } from "../../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const ProfileInfo = () => {
  const { t } = useTranslation();
  const [userData, setUserData] = useState({});
  const [editData, setEditData] = useState({
    displayName: '',
    location: '',
    language: '',
    bio: '',
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const docRef = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserData(data);
          setEditData({
            displayName: data.displayName || '',
            location: data.location || '',
            language: data.language || '',
            bio: data.bio || '',
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchUser();
  }, []);

  const handleSave = async () => {
    try {
      const docRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(docRef, {
        displayName: editData.displayName,
        location: editData.location,
        language: editData.language,
        bio: editData.bio,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
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
        {t("yourProfile") || "your profile"}
      </h2>

      <div className="flex flex-col items-center">
        <img
          src={userData.photoURL || "https://via.placeholder.com/150"}
          alt="profile"
          className="w-36 h-36 rounded-full object-cover mb-6 border-4 border-[#FF6B6B]"
        />

        <div className="w-full max-w-md space-y-6">
          <div>
            <label className="font-semibold lowercase text-gray-700">
              {t("yourName") || "your name"}:
            </label>
            <input
              type="text"
              value={editData.displayName}
              onChange={(e) => setEditData({ ...editData, displayName: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-3 mt-2 focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
            />
          </div>

          <div>
            <label className="font-semibold lowercase text-gray-700">
              {t("shortBio") || "short bio"}:
            </label>
            <textarea
              value={editData.bio}
              onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-3 mt-2 focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
              rows={3}
            />
          </div>

          <div>
            <label className="font-semibold lowercase text-gray-700">
              {t("preferredLanguage") || "preferred language"}:
            </label>
            <input
              type="text"
              value={editData.language}
              onChange={(e) => setEditData({ ...editData, language: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-3 mt-2 focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
            />
          </div>

          <div>
            <label className="font-semibold lowercase text-gray-700">
              {t("preferredLocation") || "preferred location"}:
            </label>
            <input
              type="text"
              value={editData.location}
              onChange={(e) => setEditData({ ...editData, location: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-3 mt-2 focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
            />
          </div>

          <button
            onClick={handleSave}
            className="w-full bg-[#FF6B6B] text-white py-3 rounded-lg font-semibold hover:bg-[#e15555] transition-all"
          >
            {t("saveChanges") || "save changes"}
          </button>

          {saved && (
            <p className="text-green-600 text-center font-semibold mt-4">
              {t("savedSuccessfully") || "profile updated successfully!"}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileInfo;
