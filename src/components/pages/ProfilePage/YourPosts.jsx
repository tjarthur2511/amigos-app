// src/components/pages/ProfilePage/YourPosts.jsx
import React, { useEffect, useState } from "react";
import { db, auth } from "../../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

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
      className="flex flex-col items-center space-y-6 p-6 bg-white rounded-2xl shadow-lg font-[Comfortaa]"
    >
      <h2 className="text-3xl font-bold text-[#FF6B6B] lowercase">
        {t("yourPosts") || "your posts"}
      </h2>

      {posts.length === 0 ? (
        <p className="text-gray-600 lowercase">
          {t("noPosts") || "you haven't posted anything yet."}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
          {posts.map((post) => (
            <div
              key={post.id}
              className="border rounded-xl p-6 shadow-md bg-gray-50 hover:shadow-lg transition-all"
            >
              <h4 className="text-xl font-bold text-[#FF6B6B] mb-2 lowercase">
                {post.title || t("untitledPost") || "untitled post"}
              </h4>
              <p className="text-gray-700">
                {post.content || t("noContent") || "no content available."}
              </p>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default YourPosts;
