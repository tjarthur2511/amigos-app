// src/components/pages/ProfilePage/PublicProfilePage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { auth, db } from '../../../firebase.js';
import NavBar from '../../NavBar';
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
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';

const PublicProfilePage = () => {
  const { userId } = useParams();
  const [currentUserId, setCurrentUserId] = useState(null);
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [grupos, setGrupos] = useState([]);
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
      setPosts(postSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      const answerQuery = query(
        collection(db, 'quizAnswers'),
        where('userId', '==', userId),
        orderBy('answeredAt', 'desc'),
        limit(10)
      );
      const answerSnap = await getDocs(answerQuery);
      setAnswers(answerSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      const grupoQuery = query(
        collection(db, 'grupos'),
        where('members', 'array-contains', userId),
        orderBy('lastActivity', 'desc'),
        limit(5)
      );
      const grupoSnap = await getDocs(grupoQuery);
      setGrupos(grupoSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      setLoading(false);
    };
    init();
  }, [userId]);

  const toggleFollow = async () => {
    if (!currentUserId || !userId) return;
    const currentUserRef = doc(db, 'users', currentUserId);
    await updateDoc(currentUserRef, {
      following: isFollowing ? arrayRemove(userId) : arrayUnion(userId),
    });
    setIsFollowing(!isFollowing);
  };

  if (loading) return <div className="text-center mt-20 text-white">Loading profile...</div>;
  if (!userData) return <div className="text-center mt-20 text-white">User not found.</div>;

  const backgroundClass = userData.background === 'beach' ? 'bg-gradient-to-br from-yellow-100 to-blue-200' :
                          userData.background === 'city' ? 'bg-gradient-to-br from-gray-200 to-gray-400' :
                          userData.background === 'forest' ? 'bg-gradient-to-br from-green-100 to-green-400' :
                          userData.background === 'galaxy' ? 'bg-gradient-to-br from-purple-900 to-indigo-700 text-white' :
                          'bg-[#FFF1F1]';

  return (
    <div className={`min-h-screen font-[Comfortaa] ${backgroundClass}`}>
      <NavBar />
      <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="flex items-center gap-4 mb-6">
          <img
            src={userData.photoURL || 'https://cdn-icons-png.flaticon.com/512/847/847969.png'}
            alt="avatar"
            className="w-20 h-20 rounded-full object-cover border-2 border-[#FF6B6B]"
          />
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-[#FF6B6B]">{userData.displayName || 'Unnamed Amigo'}</h2>
            <p className="text-sm text-gray-600 text-center">{userData.bio || 'No bio provided.'}</p>
            <div className="text-xs text-center mt-1 text-gray-500">
              <p><strong>Status:</strong> {userData.status || 'No status'}</p>
              <p><strong>Hobbies:</strong> {userData.hobbies || 'No hobbies listed'}</p>
              <p><strong>Pronouns:</strong> {userData.pronouns || 'Not set'}</p>
              <p><strong>Location:</strong> {userData.location || 'Unknown'}</p>
            </div>
          </div>
          {currentUserId !== userId && (
            <button
              onClick={toggleFollow}
              className={`px-4 py-2 rounded-full font-semibold text-sm transition duration-150 ${
                isFollowing
                  ? 'bg-gray-300 text-black hover:bg-gray-400'
                  : 'bg-[#FF6B6B] text-white hover:bg-[#ff4c4c]'
              }`}
            >
              {isFollowing ? 'Unfollow' : 'Follow'}
            </button>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-[#FF6B6B] mb-2">Recent Posts</h3>
            {posts.length > 0 ? (
              <ul className="space-y-2">
                {posts.map(post => (
                  <li key={post.id} className="p-4 bg-white rounded shadow">
                    <p>{post.content}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No posts yet.</p>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[#FF6B6B] mb-2">Recent Quiz Answers</h3>
            {answers.length > 0 ? (
              <ul className="space-y-2">
                {answers.map(answer => (
                  <li key={answer.id} className="p-4 bg-white rounded shadow">
                    <p><strong>Q:</strong> {answer.question}</p>
                    <p><strong>A:</strong> {answer.answer}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No recent answers.</p>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[#FF6B6B] mb-2">Grupos</h3>
            {grupos.length > 0 ? (
              <ul className="space-y-2">
                {grupos.map(grupo => (
                  <li key={grupo.id} className="p-4 bg-white rounded shadow">
                    <p className="font-bold">{grupo.name}</p>
                    <p>{grupo.description}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">Not part of any grupos yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfilePage;
