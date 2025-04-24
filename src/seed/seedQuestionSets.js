import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

export const seedQuestionSets = async () => {
  await addDoc(collection(db, 'questionSets'), {
    type: 'monthly',
    month: '2025-04',
    questions: [
      'What hobby did you try for the first time this month?',
      'If you had a free Saturday, how would you spend it?',
      'Would you rather hang out one-on-one or in a group?',
      'Which local spot do you recommend most?',
      'Describe your perfect chill day in 5 words.'
    ]
  });

  console.log('✅ Monthly AI questions seeded');
};
