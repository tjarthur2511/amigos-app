import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useTranslation } from "react-i18next";

const YourPosts = () => {
  const [posts, setPosts] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchPosts = async () => {
      const q = query(
        collection(db, "posts"),
        where("uid", "==", auth.currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      const postList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postList);
    };

    fetchPosts();
  }, []);

  return (
    <div className="your-posts">
      <h2>{t("yourPosts")}</h2>
      {posts.length === 0 ? (
        <p>{t("noPosts")}</p>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="post">
            <h4>{post.title || t("untitledPost")}</h4>
            <p>{post.content || t("noContent")}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default YourPosts;
