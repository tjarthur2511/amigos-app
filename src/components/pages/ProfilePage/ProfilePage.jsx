// src/components/pages/ProfilePage/ProfilePage.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { db, auth } from "../../../firebase";
import { doc, getDoc } from "firebase/firestore";

import ProfileInfo from "./ProfileInfo";
import YourPosts from "./YourPosts";
import YourGrupos from "./YourGrupos";
import QuizTab from "./QuizTab";
import Preferences from "./Preferences";
import Settings from "./Settings";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

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
        console.error("❌ Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen font-[Comfortaa] text-[#FF6B6B]">
        <p>loading your profile...</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen font-[Comfortaa]">
        <p className="text-red-500">profile not found. please log in again.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="container mx-auto px-4 py-8 font-[Comfortaa]"
    >
      <h1 className="text-4xl font-bold text-[#FF6B6B] mb-8 text-center lowercase">
        your profile
      </h1>

      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {[
          { name: "profile", label: "profile info" },
          { name: "posts", label: "your posts" },
          { name: "grupos", label: "your grupos" },
          { name: "quiz", label: "quiz history" },
          { name: "preferences", label: "preferences" },
          { name: "settings", label: "settings" },
        ].map((tab) => (
          <button
            key={tab.name}
            className={`px-4 py-2 rounded-full font-semibold lowercase ${
              activeTab === tab.name
                ? "bg-[#FF6B6B] text-white"
                : "bg-white text-[#FF6B6B] border border-[#FF6B6B]"
            }`}
            onClick={() => setActiveTab(tab.name)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dynamic Content Based on Active Tab */}
      <div className="bg-white p-6 rounded-2xl shadow-lg max-w-5xl mx-auto w-full space-y-6">
        {activeTab === "profile" && <ProfileInfo />}
        {activeTab === "posts" && <YourPosts />}
        {activeTab === "grupos" && <YourGrupos />}
        {activeTab === "quiz" && <QuizTab />}
        {activeTab === "preferences" && <Preferences />}
        {activeTab === "settings" && <Settings />}
      </div>
    </motion.div>
  );
};

export default ProfilePage;
