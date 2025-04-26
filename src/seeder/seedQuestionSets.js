// src/seeder/seedQuestionSets.js
import { db } from '../firebase.js';
import { collection, addDoc } from 'firebase/firestore';

export const seedQuestionSets = async () => {
  // Onboarding quiz (used for q1–q10)
  await addDoc(collection(db, 'questionSets'), {
    type: 'onboarding',
    questions: [
      "What's your favorite way to relax?",
      "Which activities make you lose track of time?",
      "Do you prefer small groups or big gatherings?",
      "What do you enjoy doing outdoors?",
      "What’s a new skill you’d like to learn?",
      "What kind of games do you love?",
      "What’s your go-to creative outlet?",
      "Do you prefer daytime or nighttime adventures?",
      "How do you usually spend weekends?",
      "What topic could you talk about for hours?"
    ]
  });

  // Monthly quiz (April 2025)
  await addDoc(collection(db, 'questionSets'), {
    type: 'monthly',
    month: '2025-04',
    questions: [
      "What hobby did you try this month?",
      "What made you smile recently?",
      "What’s your biggest goal right now?",
      "How did you unwind last weekend?",
      "What’s a small win you’re proud of?"
    ]
  });

  console.log('✅ Seeded AI-generated onboarding and monthly questions');
};
