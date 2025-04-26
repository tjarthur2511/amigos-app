import React, { useEffect, useState } from "react";
import { auth, db } from "../../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useTranslation } from "react-i18next";

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
      const docRef = doc(db, "users", auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserData(docSnap.data());
        setEditData({
          displayName: docSnap.data().displayName || '',
          location: docSnap.data().location || '',
          language: docSnap.data().language || '',
          bio: docSnap.data().bio || '',
        });
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
      setTimeout(() => setSaved(false), 3000); // Hide saved message after 3s
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      <h2 className="text-2xl font-bold">{t("yourProfile")}</h2>

      <div className="flex flex-col items-center">
        <img
          src={userData.photoURL || "https://via.placeholder.com/150"}
          alt="Profile"
          className="w-36 h-36 rounded-full object-cover mb-4"
        />

        <div className="w-full max-w-md space-y-4">
          <div>
            <label className="font-semibold">{t("yourName")}:</label>
            <input
              type="text"
              value={editData.displayName}
              onChange={(e) => setEditData({ ...editData, displayName: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-2 mt-1"
            />
          </div>

          <div>
            <label className="font-semibold">{t("shortBio")}:</label>
            <textarea
              value={editData.bio}
              onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-2 mt-1"
              rows={3}
            />
          </div>

          <div>
            <label className="font-semibold">{t("preferredLanguage")}:</label>
            <input
              type="text"
              value={editData.language}
              onChange={(e) => setEditData({ ...editData, language: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-2 mt-1"
            />
          </div>

          <div>
            <label className="font-semibold">{t("preferredLocation")}:</label>
            <input
              type="text"
              value={editData.location}
              onChange={(e) => setEditData({ ...editData, location: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-2 mt-1"
            />
          </div>

          <button
            onClick={handleSave}
            className="mt-4 bg-[#FF6B6B] text-white py-2 px-4 rounded-lg font-semibold hover:bg-[#ff8585] transition-all"
          >
            {t("saveChanges") || "Save Changes"}
          </button>

          {saved && (
            <p className="text-green-600 text-center mt-2">
              {t("savedSuccessfully") || "Profile updated successfully!"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
