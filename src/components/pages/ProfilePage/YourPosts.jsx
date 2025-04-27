// src/components/pages/ProfilePage/YourPosts.jsx
import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion"; // ✅ smooth animations

const YourPosts = () => {
  const [posts, setPosts] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(
          collection(db, "posts"),
          where("userId", "==", auth.currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        const postList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(postList);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col items-center space-y-6 p-6 bg-gray-50 rounded-2xl shadow-lg"
    >
      <h2 className="text-3xl font-bold text-[#FF6B6B]">
        {t("yourPosts") || "Your Posts"}
      </h2>

      {posts.length === 0 ? (
        <p className="text-gray-600">
          {t("noPosts") || "You haven't posted anything yet."}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
          {posts.map((post) => (
            <div
              key={post.id}
              className="border rounded-xl p-6 shadow-md bg-white hover:shadow-lg transition-all"
            >
              <h4 className="text-xl font-bold text-[#FF6B6B] mb-2">
                {post.title || t("untitledPost") || "Untitled Post"}
              </h4>
              <p className="text-gray-700">
                {post.content || t("noContent") || "No content available."}
              </p>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default YourPosts;
