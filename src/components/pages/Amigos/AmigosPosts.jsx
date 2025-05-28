// ✅ AmigosPosts - Clean Layout, White Cards, No Background
import React, { useEffect, useState } from 'react';
import { db, auth } from '../../../firebase';
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  doc,
  getDoc
} from 'firebase/firestore';
import PostCard from '../../common/PostCard';

const AmigosPosts = () => {
  const [amigosPosts, setAmigosPosts] = useState([]);

  useEffect(() => {
    const loadAmigosPosts = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) return;

      const { following = [] } = userSnap.data();

      if (!following.length) {
        setAmigosPosts([]);
        return;
      }

      const postSnap = await getDocs(
        query(collection(db, 'posts'), orderBy('createdAt', 'desc'))
      );

      const allPosts = postSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const filtered = allPosts.filter(post =>
        Array.isArray(post.taggedAmigos) &&
        post.taggedAmigos.some(tagged => following.includes(tagged))
      );

      setAmigosPosts(filtered);
    };

    loadAmigosPosts();
  }, []);

  // Define reused class strings
  const titleClasses = "text-xl text-coral font-bold text-center mb-4"; // text-xl for 1.5rem approx
  const itemClasses = "bg-white p-4 rounded-xl shadow-[0_2px_6px_rgba(0,0,0,0.15)] z-0"; // rounded-xl for 1rem

  return (
    <div className="font-comfortaa bg-white p-8 rounded-[1.5rem] shadow-[0_5px_20px_rgba(0,0,0,0.1)] z-0">
      <h3 className={titleClasses}>Your Amigos’ Posts</h3>
      {amigosPosts.length > 0 ? (
        <ul className="flex flex-col gap-4">
          {amigosPosts.map(post => (
            <li key={post.id} className={itemClasses}> {/* Using itemClasses defined above */}
              <PostCard post={post} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-coral text-center mt-4">Your amigos haven’t posted anything yet.</p>
      )}
    </div>
  );
};

// Style object constants are no longer needed.

export default AmigosPosts;
