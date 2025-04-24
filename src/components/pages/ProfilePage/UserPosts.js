import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useTranslation } from "react-i18next";

const UserPosts = () => {
  const { t } = useTranslation();
  const [posts, setPosts] = useState([]);

  const fetchUserPosts = async () => {
    const q = query(collection(db, "posts"), where("userId", "==", auth.currentUser.uid));
    const querySnapshot = await getDocs(q);
    const userPosts = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setPosts(userPosts);
  };

  useEffect(() => {
    fetchUserPosts();
  }, []);

  return (
    <div>
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

export default UserPosts;
