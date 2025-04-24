// src/seeder/seedReactions.js
import { db } from '../firebase.js';
import { collection, addDoc } from 'firebase/firestore';

const seedReactions = async () => {
  const reactions = [
    {
      postId: 'demo-post-1',
      userId: 'user123',
      type: 'like',
      emoji: '🔥'
    },
    {
      postId: 'demo-post-2',
      userId: 'user456',
      type: 'dislike',
      emoji: '👎'
    }
  ];

  for (const reaction of reactions) {
    await addDoc(collection(db, 'reactions'), reaction);
  }

  console.log('✅ Reactions seeded');
};

export default seedReactions();
