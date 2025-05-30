import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import FallingAEffect from '../common/FallingAEffect';
import Spinner from '../common/Spinner'; // Import Spinner
import PostCard from '../common/PostCard'; // Import PostCard

const Explore = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const POSTS_LIMIT = 20; // Number of recent posts to fetch

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const postsRef = collection(db, 'posts');
        const q = query(postsRef, orderBy('createdAt', 'desc'), limit(POSTS_LIMIT));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          setPosts([]);
        } else {
          const fetchedPosts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setPosts(fetchedPosts);
        }
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Failed to load posts. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Define reused class strings from existing component structure (can be adjusted)
  const tabClasses = "bg-coral text-white border-none py-3 px-5 rounded-button text-base font-comfortaa font-bold cursor-pointer shadow-md hover:bg-coral-dark transition-all focus:outline-none focus:ring-2 focus:ring-coral-dark active:scale-95";
  const sectionTitleClasses = "text-3xl text-coral mb-6 text-center";

  return (
    <div className="font-comfortaa bg-transparent min-h-screen overflow-hidden relative z-0">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full -z-[1000] bg-coral" />
      <div className="absolute top-0 left-0 w-full h-full -z-[500] pointer-events-none">
        <FallingAEffect />
      </div>

      {/* Header and Navigation (consistent with other pages) */}
      <header className="flex justify-center pt-4 mb-[-1rem] z-[10]">
        <img
          src="/assets/amigoshangouts1.png"
          alt="Amigos Hangouts"
          className="h-[20em] w-auto animate-[pulse-a_1.75s_infinite] mb-[-5rem]"
        />
      </header>

      <nav className="flex justify-center mt-0 mb-6 z-[10]">
        <div className="bg-white py-3 px-4 rounded-button shadow-lg flex gap-4">
          <button onClick={() => navigate('/')} className={tabClasses}>Home</button>
          <button onClick={() => navigate('/amigos')} className={tabClasses}>Amigos</button>
          <button onClick={() => navigate('/grupos')} className={tabClasses}>Grupos</button>
          <button onClick={() => navigate('/profile')} className={tabClasses}>Profile</button>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex justify-center mb-8 z-[10]">
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl w-[90%] max-w-[800px] min-h-[60vh] text-center relative">
          <h2 className={sectionTitleClasses}>Explore Recent Posts</h2>

          {isLoading && (
            <div className="flex justify-center items-center h-64">
              <Spinner size="lg" color="coral" />
            </div>
          )}

          {!isLoading && error && (
            <div className="text-center py-10">
              <p className="text-red-500 text-lg">{error}</p>
              {/* Optionally, add a retry button here */}
            </div>
          )}

          {!isLoading && !error && posts.length === 0 && (
            <div className="text-center py-10">
              <p className="text-neutral-600 text-lg">No posts found. Be the first to share something, or check back later!</p>
            </div>
          )}

          {!isLoading && !error && posts.length > 0 && (
            <div className="grid grid-cols-1 gap-6 mt-4">
              {/* 
                Alternatively, for a multi-column layout on larger screens:
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4"> 
                This would require PostCard to be designed to fit well in such a grid.
                For simplicity, starting with a single column (similar to HomePage).
              */}
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Explore;
