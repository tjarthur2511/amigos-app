import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../../../firebase';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc
} from 'firebase/firestore';
import FallingAEffect from '../../common/FallingAEffect';
import ProfilePhotos from './ProfilePhotos';
import ProfileQuestionsCenter from './ProfileQuestionsCenter';
import ProfileCard from './ProfileCard';
import NavBar from '../../NavBar';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [currentCard, setCurrentCard] = useState(0);
  const feedCards = ['YOUR POSTS', 'PHOTOS', 'PREFERENCES'];

  useEffect(() => {
    document.body.classList.add('profile-page');
    return () => document.body.classList.remove('profile-page');
  }, []);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (!user) return;

      const q = query(
        collection(db, 'posts'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );

      const unsubscribePosts = onSnapshot(q, (snapshot) => {
        const userPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPosts(userPosts);
      });

      return () => unsubscribePosts();
    });

    return () => unsubscribeAuth();
  }, []);

  const handleDelete = async (postId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this post?');
    if (!confirmDelete) return;
    try {
      await deleteDoc(doc(db, 'posts', postId));
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  const nextCard = () => setCurrentCard((prev) => (prev + 1) % feedCards.length);
  const prevCard = () => setCurrentCard((prev) => (prev - 1 + feedCards.length) % feedCards.length);

  const renderCurrent = () => {
    switch (feedCards[currentCard]) {
      case 'YOUR POSTS':
        return posts.length > 0 ? (
          <ul className="flex flex-col gap-4">
            {posts.map(post => (
              <li key={post.id} className="bg-white p-4 rounded-xl shadow border border-[#ffe0e0]">
                <p className="text-lg font-semibold">{post.content || 'Untitled Post'}</p>
                {post.imageUrl && <img src={post.imageUrl} alt="Post" className="rounded-lg mt-2" />}
                {post.videoUrl && (
                  <video controls className="rounded-lg mt-2">
                    <source src={post.videoUrl} type="video/mp4" />
                  </video>
                )}
                <button
                  onClick={() => handleDelete(post.id)}
                  className="mt-3 text-sm text-[#FF6B6B] hover:underline"
                >🗑️ Delete</button>
              </li>
            ))}
          </ul>
        ) : <p className="text-center text-[#FF6B6B]">You haven't posted anything yet.</p>;

      case 'PHOTOS':
        return <ProfilePhotos posts={posts} />;

      case 'PREFERENCES':
        return <ProfileQuestionsCenter />;

      default:
        return null;
    }
  };

  return (
    <div>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <FallingAEffect />
      </div>

      <header className="text-center pt-10 z-10 relative">
        <h1 className="text-4xl font-bold text-[#FF6B6B] drop-shadow">amigos</h1>
      </header>

      <ProfileCard />
      <NavBar />

      <main className="relative z-10 flex justify-center">
        <div className="bg-white rounded-3xl shadow-xl p-6 w-full max-w-3xl relative">
          <h2 className="text-2xl font-bold text-[#FF6B6B] text-center mb-4">
            {feedCards[currentCard]}
          </h2>
          {renderCurrent()}
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <button
              onClick={nextCard}
              className="text-2xl text-[#FF6B6B] font-bold bg-white border border-[#FF6B6B] rounded-full px-3 py-1 shadow hover:bg-[#FF6B6B] hover:text-white transition"
            >→</button>
          </div>
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <button
              onClick={prevCard}
              className="text-2xl text-[#FF6B6B] font-bold bg-white border border-[#FF6B6B] rounded-full px-3 py-1 shadow hover:bg-[#FF6B6B] hover:text-white transition"
            >←</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
