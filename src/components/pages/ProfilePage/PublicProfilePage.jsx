// src/components/pages/ProfilePage/PublicProfilePage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../../firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
} from 'firebase/firestore';

const PublicProfilePage = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const ref = doc(db, 'users', userId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setUserData(snap.data());
      }
    };

    const fetchPosts = async () => {
      const q = query(
        collection(db, 'posts'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(results);
    };

    if (userId) {
      fetchUser();
      fetchPosts();
      setLoading(false);
    }
  }, [userId]);

  if (loading || !userData) return null;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 font-[Comfortaa]">
      <div className="flex items-center gap-4 mb-6">
        <img
          src={userData.photoURL || 'https://cdn-icons-png.flaticon.com/512/847/847969.png'}
          alt="avatar"
          className="w-20 h-20 rounded-full object-cover border-2 border-[#FF6B6B]"
        />
        <div>
          <h2 className="text-2xl font-bold text-[#FF6B6B]">{userData.displayName || 'Unnamed Amigo'}</h2>
          <p className="text-sm text-gray-600">{userData.bio || 'No bio provided.'}</p>
        </div>
      </div>

      <div className="space-y-4">
        {posts.map(post => (
          <div
            key={post.id}
            className="bg-white p-4 rounded-xl shadow border border-[#ffe0e0]"
          >
            <p className="text-[#333] mb-2">{post.content || 'Untitled Post'}</p>
            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt="Post"
                className="w-full rounded-lg"
              />
            )}
            {post.videoUrl && (
              <video controls className="w-full rounded-lg">
                <source src={post.videoUrl} type="video/mp4" />
              </video>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PublicProfilePage;
