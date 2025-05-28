import React, { useEffect, useState } from 'react';
import { db, auth } from '../../../firebase';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';

const ProfilePhotos = () => {
  const [photoPosts, setPhotoPosts] = useState([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, 'posts'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const photos = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(post => !!post.imageUrl);
      setPhotoPosts(photos);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="font-comfortaa bg-blush p-6 rounded-3xl shadow-xl max-w-2xl mx-auto animate-fade-in"> {/* Used font-comfortaa and bg-blush */}
      <h2 className="text-xl sm:text-2xl text-coral text-center font-bold mb-6"> {/* Used text-coral */}
        📸 Your Photo Gallery
      </h2>

      {photoPosts.length > 0 ? (
        <div className="flex flex-col gap-5 max-h-[420px] overflow-y-auto pr-1">
          {photoPosts.map((post) => (
            <div
              key={post.id}
              className="bg-blush p-2 rounded-2xl rounded-bl-md max-w-xs shadow-md transition-transform hover:scale-[1.015] hover:shadow-lg" // Used bg-blush
            >
              <img
                src={post.imageUrl}
                alt="Post"
                className="w-full h-auto object-cover rounded-xl"
              />
              {post.createdAt?.toDate && (
                <p className="text-xs text-right text-gray-500 mt-1">
                  {post.createdAt.toDate().toLocaleDateString()}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-coral text-center text-sm mt-4"> {/* Used text-coral */}
          You haven't posted any photos yet.
        </p>
      )}
    </div>
  );
};

export default ProfilePhotos;
