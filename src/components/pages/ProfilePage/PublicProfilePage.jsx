// src/components/pages/ProfilePage/PublicProfilePage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { auth, db } from '../../../firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';

const PublicProfilePage = () => {
  const { userId } = useParams();
  const [currentUserId, setCurrentUserId] = useState(null);
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [following, setFollowing] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const user = auth.currentUser;
      if (!user || !userId) return;

      setCurrentUserId(user.uid);

      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.exists() ? userSnap.data() : {};
      const userFollowing = userData.following || [];

      setFollowing(userFollowing);
      setIsFollowing(userFollowing.includes(userId));

      const publicRef = doc(db, 'users', userId);
      const publicSnap = await getDoc(publicRef);
      if (publicSnap.exists()) {
        setUserData(publicSnap.data());
      }

      const postQuery = query(
        collection(db, 'posts'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const postSnap = await getDocs(postQuery);
      const postList = postSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(postList);

      const answerQuery = query(
        collection(db, 'quizAnswers'),
        where('userId', '==', userId),
        orderBy('answeredAt', 'desc'),
        limit(10)
      );
      const answerSnap = await getDocs(answerQuery);
      const answerList = answerSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAnswers(answerList);

      const grupoQuery = query(
        collection(db, 'grupos'),
        where('members', 'array-contains', userId),
        orderBy('lastActivity', 'desc'),
        limit(5)
      );
      const grupoSnap = await getDocs(grupoQuery);
      const grupoList = grupoSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setGrupos(grupoList);

      setLoading(false);
    };
    init();
  }, [userId]);

  const toggleFollow = async () => {
    if (!currentUserId) return;
    const userRef = doc(db, 'users', currentUserId);
    const updated = isFollowing
      ? following.filter(id => id !== userId)
      : [...following, userId];
    await updateDoc(userRef, { following: updated });
    setFollowing(updated);
    setIsFollowing(!isFollowing);
  };

  if (loading) {
    return <div className="text-center mt-20 text-white">Loading profile...</div>;
  }

  if (!userData) {
    return <div className="text-center mt-20 text-white">User not found.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 font-[Comfortaa]">
      <div className="flex items-center gap-4 mb-6">
        <img
          src={userData.photoURL || 'https://cdn-icons-png.flaticon.com/512/847/847969.png'}
          alt="avatar"
          className="w-20 h-20 rounded-full object-cover border-2 border-[#FF6B6B]"
        />
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-[#FF6B6B]">{userData.displayName || 'Unnamed Amigo'}</h2>
          <p className="text-sm text-gray-600">{userData.bio || 'No bio provided.'}</p>
        </div>
        {currentUserId !== userId && (
          <button
            onClick={toggleFollow}
            className={`px-4 py-2 rounded-full font-semibold text-sm transition duration-150 ${isFollowing ? 'bg-gray-300 text-black' : 'bg-[#FF6B6B] text-white hover:bg-[#e15555]'}`}
          >
            {isFollowing ? 'Unfollow' : 'Follow'}
          </button>
        )}
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-[#FF6B6B] mb-2">Recent Posts</h3>
        {posts.length === 0 ? (
          <p className="text-sm text-gray-500">No posts yet.</p>
        ) : (
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
        )}
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-[#FF6B6B] mb-2">Recent Answers</h3>
        {answers.length === 0 ? (
          <p className="text-sm text-gray-500">No answers submitted yet.</p>
        ) : (
          <ul className="space-y-2">
            {answers.map(answer => (
              <li key={answer.id} className="bg-white p-3 rounded-lg border border-[#ffd9d9]">
                <p className="text-[#444]"><span className="font-semibold">Q:</span> {answer.question}</p>
                <p className="text-[#333] mt-1"><span className="font-semibold">A:</span> {answer.answer}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-[#FF6B6B] mb-2">Recent Grupos</h3>
        {grupos.length === 0 ? (
          <p className="text-sm text-gray-500">Not part of any grupos yet.</p>
        ) : (
          <ul className="space-y-2">
            {grupos.map(grupo => (
              <li key={grupo.id} className="bg-white p-3 rounded-lg border border-[#ffd9d9]">
                <p className="text-[#444] font-semibold">{grupo.name || 'Unnamed Grupo'}</p>
                <Link
                  to={`/grupos/${grupo.id}`}
                  className="text-sm text-[#FF6B6B] hover:underline"
                >
                  View Grupo
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PublicProfilePage;
