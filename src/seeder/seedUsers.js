import { db } from '../firebase.js';
import { collection, addDoc } from 'firebase/firestore';

const seedUsers = async () => {
  const users = [
    { displayName: 'LunaBot', email: 'luna@amigos.ai', quizAnswers: {}, monthlyQuiz: {} },
    { displayName: 'ZenBot', email: 'zen@amigos.ai', quizAnswers: {}, monthlyQuiz: {} },
    { displayName: 'PixelPal', email: 'pixel@amigos.ai', quizAnswers: {}, monthlyQuiz: {} },
    { displayName: 'EchoBot', email: 'echo@amigos.ai', quizAnswers: {}, monthlyQuiz: {} },
    { displayName: 'NovaBot', email: 'nova@amigos.ai', quizAnswers: {}, monthlyQuiz: {} },
  ];

  const userCollection = collection(db, 'users');

  for (const user of users) {
    await addDoc(userCollection, user);
    console.log(`✅ Seeded user: ${user.displayName}`);
  }

  console.log('🌱 Done seeding users!');
};

export default seedUsers;
