// src/components/pages/ProfilePage/ProfilePage.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { db, auth } from "../../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setUserData(snap.data());
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <p>Loading your profile...</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <p className="text-red-500">Profile not found. Please log in again.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-3xl md:text-4xl font-bold text-[#FF6B6B] mb-6">
        Your Profile
      </h1>

      <div className="bg-white p-6 rounded-2xl shadow-lg max-w-2xl mx-auto space-y-6">
        <div className="flex flex-col items-center space-y-2">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-4xl font-bold text-[#FF6B6B]">
            {userData.displayName ? userData.displayName[0] : "A"}
          </div>
          <h2 className="text-2xl font-semibold">{userData.displayName || "Amigo"}</h2>
          <p className="text-gray-600">{userData.email}</p>
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => navigate("/settings")}
            className="px-6 py-2 bg-[#FF6B6B] text-white rounded-xl hover:bg-[#e15555] transition"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
